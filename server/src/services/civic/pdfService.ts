import { jsPDF } from 'jspdf';
import { CivicJourney, ProcedureStep } from '../../types.js';

/**
 * Generates the official DishaSaathi visual roadmap graph PDF as a binary Buffer.
 * Page 1: Landscape A4 Visual Flowchart Dependency Graph with connected vector nodes,
 *         arrow connectors, status colors, departments, processing times, and fees.
 * Page 2: Comprehensive statutory procedure checklist, required documents & portal URLs.
 */
export function generateRoadmapPdfBuffer(journey: CivicJourney, citizenName: string = 'Citizen'): Buffer {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pdfHeight = doc.internal.pageSize.getHeight(); // 210mm

  // ==========================================
  // PAGE 1: LANDSCAPE VISUAL ROADMAP GRAPH
  // ==========================================

  // 1. Top Green Header Banner (24mm tall)
  doc.setFillColor(27, 77, 62); // #1B4D3E
  doc.rect(0, 0, pdfWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('DISHASAATHI — OFFICIAL CIVIC ROADMAP GRAPH', 12, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 230, 215);
  doc.text(
    `${journey.title || 'Civic Procedure Roadmap'}   |   Jurisdiction: ${journey.location || 'India'}   |   Category: ${journey.category || 'Statutory Compliance'}`,
    12,
    17
  );

  // Top-Right Metric Pill
  const rawSteps = journey.steps || [];
  const completedCount = rawSteps.filter((s) => s.status === 'Completed').length;
  const totalCount = rawSteps.length || journey.totalSteps || 1;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  doc.setFillColor(38, 98, 80);
  doc.roundedRect(pdfWidth - 78, 6, 66, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`${completedCount}/${totalCount} Steps Done (${progressPct}%)`, pdfWidth - 45, 13.5, { align: 'center' });

  // 2. Compute Flowchart Coordinates
  const stepById = new Map<string, ProcedureStep>();
  rawSteps.forEach((s) => stepById.set(s.id, s));

  // Determine columns and rows
  const numSteps = rawSteps.length;
  const cols = numSteps <= 4 ? numSteps : Math.min(Math.ceil(numSteps / 2), 4);
  const rows = numSteps <= 4 ? 1 : 2;

  const cardWidth = cols <= 3 ? 68 : 58;
  const cardHeight = rows === 1 ? 52 : 46;
  const colGap = cols <= 3 ? 20 : 14;
  const rowGap = 16;

  const totalGridWidth = cols * cardWidth + (cols - 1) * colGap;
  const totalGridHeight = rows * cardHeight + (rows - 1) * rowGap;

  const startX = (pdfWidth - totalGridWidth) / 2;
  const startY = 24 + ((pdfHeight - 24 - 18) - totalGridHeight) / 2;

  const stepPositions = new Map<string, { x: number; y: number }>();

  rawSteps.forEach((step, idx) => {
    let colIdx = idx;
    let rowIdx = 0;
    if (rows === 2) {
      if (idx < cols) {
        colIdx = idx;
        rowIdx = 0;
      } else {
        colIdx = idx - cols;
        rowIdx = 1;
      }
    }
    const x = startX + colIdx * (cardWidth + colGap);
    const y = startY + rowIdx * (cardHeight + rowGap);
    stepPositions.set(step.id, { x, y });
  });

  // 3. Draw Connector Lines & Arrowheads (behind cards)
  doc.setLineWidth(0.7);
  rawSteps.forEach((step, idx) => {
    const targetPos = stepPositions.get(step.id);
    if (!targetPos) return;

    const prereqIds = (step.prerequisites && step.prerequisites.length > 0)
      ? step.prerequisites
      : idx > 0 ? [rawSteps[idx - 1].id] : [];

    prereqIds.forEach((prereqId) => {
      const sourcePos = stepPositions.get(prereqId);
      if (!sourcePos) return;

      const prereqStep = stepById.get(prereqId);
      const isDone = prereqStep?.status === 'Completed';

      const sX = sourcePos.x + cardWidth;
      const sY = sourcePos.y + cardHeight / 2;
      const tX = targetPos.x;
      const tY = targetPos.y + cardHeight / 2;

      const edgeR = isDone ? 16 : 148;
      const edgeG = isDone ? 185 : 163;
      const edgeB = isDone ? 129 : 184;

      doc.setDrawColor(edgeR, edgeG, edgeB);
      doc.setFillColor(edgeR, edgeG, edgeB);

      // Source anchor dot
      doc.circle(sX, sY, 1.2, 'F');

      if (Math.abs(sY - tY) < 4) {
        // Direct horizontal line
        doc.line(sX, sY, tX - 3.5, tY);
        // Arrowhead triangle
        doc.triangle(tX, tY, tX - 3.5, tY - 1.8, tX - 3.5, tY + 1.8, 'F');
      } else {
        // Stepped connector between rows
        const midX = (sX + tX) / 2;
        doc.line(sX, sY, midX, sY);
        doc.line(midX, sY, midX, tY);
        doc.line(midX, tY, tX - 3.5, tY);
        doc.triangle(tX, tY, tX - 3.5, tY - 1.8, tX - 3.5, tY + 1.8, 'F');
      }
    });
  });

  // 4. Draw Cards
  rawSteps.forEach((step) => {
    const pos = stepPositions.get(step.id);
    if (!pos) return;
    const { x, y } = pos;

    const isCompleted = step.status === 'Completed';
    const isInProgress = step.status === 'In Progress';

    let bgR = 255, bgG = 255, bgB = 255;
    let bdrR = 203, bdrG = 213, bdrB = 225;
    let badgeR = 226, badgeG = 232, badgeB = 240;
    let statusText = 'Pending';
    let statR = 100, statG = 116, statB = 139;

    if (isCompleted) {
      bgR = 240; bgG = 253; bgB = 244; // #F0FDF4
      bdrR = 16; bdrG = 185; bdrB = 129; // #10B981
      badgeR = 16; badgeG = 185; badgeB = 129;
      statusText = 'Completed';
      statR = 5; statG = 150; statB = 105;
    } else if (isInProgress) {
      bgR = 255; bgG = 251; bgB = 235; // #FFFBEB
      bdrR = 245; bdrG = 158; bdrB = 11; // #F59E0B
      badgeR = 245; badgeG = 158; badgeB = 11;
      statusText = 'In Progress';
      statR = 217; statG = 119; statB = 6;
    }

    // Card background box with border
    doc.setFillColor(bgR, bgG, bgB);
    doc.setDrawColor(bdrR, bdrG, bdrB);
    doc.setLineWidth(0.6);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');

    // Step Number Badge (Circle)
    doc.setFillColor(badgeR, badgeG, badgeB);
    doc.circle(x + 6, y + 6.5, 3.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isCompleted ? 255 : 40, isCompleted ? 255 : 40, isCompleted ? 255 : 40);
    doc.text(String(step.stepNumber || 1), x + 5.2, y + 7.8);

    // Stage tag (top-right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    const catText = (step.category || 'STATUTORY STAGE').toUpperCase();
    const truncatedCat = catText.length > 20 ? catText.slice(0, 18) + '...' : catText;
    doc.text(truncatedCat, x + cardWidth - 4, y + 7.5, { align: 'right' });

    // Step Title (bold, wrapped)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(17, 38, 31);
    const cleanTitle = (step.title || 'Step').replace(/^\d+\.\s*/, '');
    const titleLines = doc.splitTextToSize(cleanTitle, cardWidth - 8);
    doc.text(titleLines.slice(0, 2), x + 4, y + 14);

    // Authority / Department
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const auth = step.authority || step.department || 'Government Authority';
    const authStr = auth.length > 28 ? auth.slice(0, 26) + '...' : auth;
    doc.text(authStr, x + 4, y + 25);

    // Processing Time & Documents count
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    const docCount = (step.documents || []).length;
    doc.text(`${step.processingTime || '1-2 weeks'}  •  ${docCount} Doc${docCount === 1 ? '' : 's'}`, x + 4, y + 30);

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(x + 4, y + 35, x + cardWidth - 4, y + 35);

    // Footer: Status dot + text
    doc.setFillColor(statR, statG, statB);
    doc.circle(x + 6, y + 41, 1.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(statR, statG, statB);
    doc.text(statusText, x + 9.5, y + 42.5);

    // Footer: Fee
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(27, 77, 62);
    const feeStr = step.fee?.amount ? (typeof step.fee.amount === 'string' ? step.fee.amount : `₹${step.fee.amount}`) : 'Free';
    const truncatedFee = feeStr.length > 18 ? feeStr.slice(0, 16) + '...' : feeStr;
    doc.text(truncatedFee, x + cardWidth - 4, y + 42.5, { align: 'right' });
  });

  // 5. Bottom Legend & Verification Bar (11mm tall)
  const footerY = pdfHeight - 16;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(10, footerY, pdfWidth - 20, 11, 2, 2, 'FD');

  let legX = 16;
  const legY = footerY + 6.5;

  // Completed badge
  doc.setFillColor(16, 185, 129);
  doc.circle(legX, legY - 1, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Completed', legX + 4, legY);
  legX += 28;

  // In Progress badge
  doc.setFillColor(245, 158, 11);
  doc.circle(legX, legY - 1, 2, 'F');
  doc.text('In Progress', legX + 4, legY);
  legX += 30;

  // Pending badge
  doc.setFillColor(148, 163, 184);
  doc.circle(legX, legY - 1, 2, 'F');
  doc.text('Pending', legX + 4, legY);
  legX += 26;

  // Blocked badge
  doc.setFillColor(244, 63, 94);
  doc.circle(legX, legY - 1, 2, 'F');
  doc.text('Blocked Prerequisite', legX + 4, legY);

  // Verification statement & date on right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Official Gazette Grounded Flow  •  Generated for: ${citizenName}  •  ${new Date().toLocaleDateString('en-IN')}`,
    pdfWidth - 16,
    legY,
    { align: 'right' }
  );

  // ==========================================
  // PAGE 2: STEP-BY-STEP DETAILED PROCEDURE CHECKLIST
  // ==========================================
  doc.addPage('a4', 'portrait');
  const pWidth = 210;
  const pHeight = 297;
  const pMargin = 14;
  let pY = pMargin;

  // Top Banner
  doc.setFillColor(27, 77, 62);
  doc.rect(0, 0, pWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('STEP-BY-STEP STATUTORY PROCEDURE FLOW', pMargin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 230, 215);
  doc.text(`${journey.title}  •  Verified Legal Checklists & Portals`, pMargin, 17);

  pY = 32;

  rawSteps.forEach((step) => {
    if (pY > pHeight - 32) {
      doc.addPage('a4', 'portrait');
      pY = pMargin;
      doc.setFillColor(27, 77, 62);
      doc.rect(0, 0, pWidth, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`${journey.title} (Cont.)`, pMargin, 8);
      pY += 18;
    }

    const cleanTitle = (step.title || 'Step').replace(/^\d+\.\s*/, '');
    const isCompleted = step.status === 'Completed';

    doc.setFillColor(isCompleted ? 245 : 255, isCompleted ? 250 : 255, isCompleted ? 247 : 255);
    doc.setDrawColor(isCompleted ? 180 : 220, isCompleted ? 220 : 225, isCompleted ? 200 : 220);
    doc.setLineWidth(0.4);
    doc.roundedRect(pMargin, pY, pWidth - (pMargin * 2), 24, 2, 2, 'FD');

    // Step Number Circle
    doc.setFillColor(isCompleted ? 27 : 230, isCompleted ? 77 : 235, isCompleted ? 62 : 232);
    doc.circle(pMargin + 6, pY + 8, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(isCompleted ? 255 : 40, isCompleted ? 255 : 40, isCompleted ? 255 : 40);
    doc.text(`${step.stepNumber || 1}`, pMargin + 5, pY + 10);

    // Title & Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 38, 31);
    doc.text(cleanTitle, pMargin + 13, pY + 7);

    doc.setFontSize(8);
    if (isCompleted) {
      doc.setTextColor(16, 128, 92);
      doc.text('COMPLETED', pWidth - pMargin - 26, pY + 7);
    } else {
      doc.setTextColor(180, 100, 20);
      doc.text(`[${(step.status || 'PENDING').toUpperCase()}]`, pWidth - pMargin - 26, pY + 7);
    }

    // Department & Fee
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 95, 88);
    const feeStr = step.fee?.amount ? (typeof step.fee.amount === 'string' ? step.fee.amount : `₹${step.fee.amount}`) : 'Free';
    doc.text(`Authority: ${step.authority || step.department || 'Municipal Authority'}   |   Time: ${step.processingTime || '1-2 weeks'}   |   Fee: ${feeStr}`, pMargin + 13, pY + 13);

    // Documents
    const docNames = (step.documents || []).map((d) => d.name).join(', ');
    const truncatedDocs = docNames.length > 85 ? docNames.substring(0, 82) + '...' : docNames;
    doc.text(`Required Documents: ${truncatedDocs || 'None specified'}`, pMargin + 13, pY + 18);

    // Portal Link
    if (step.applicationUrl) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(27, 77, 62);
      const urlText = `Portal: ${step.applicationUrl}`;
      doc.text(urlText.length > 90 ? urlText.substring(0, 87) + '...' : urlText, pMargin + 13, pY + 22);
    }

    pY += 28;
  });

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
