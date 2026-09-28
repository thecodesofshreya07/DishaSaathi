import jsPDF from 'jspdf';
import { CivicJourney, ProcedureStep } from '../types';

// Helper for wrapping text in canvas context
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number = 2
): { lines: string[]; hasMultipleLines: boolean } {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;

      if (lines.length === maxLines - 1) {
        const remaining = words.slice(i).join(' ');
        let lastLine = remaining;
        while (ctx.measureText(lastLine + '...').width > maxWidth && lastLine.length > 0) {
          const lastSpace = lastLine.lastIndexOf(' ');
          if (lastSpace > 0) {
            lastLine = lastLine.slice(0, lastSpace);
          } else {
            lastLine = lastLine.slice(0, -1);
          }
        }
        lines.push(lastLine ? `${lastLine}...` : remaining);
        return { lines, hasMultipleLines: lines.length > 1 };
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return { lines, hasMultipleLines: lines.length > 1 };
}

// High-Resolution 2D Vector Canvas Generator for 100% Crisp, Readable PDF Graphs
function generateHighResGraphCanvas(journey: CivicJourney): HTMLCanvasElement {
  const steps = journey.steps || [];
  const stepById = new Map<string, ProcedureStep>();
  steps.forEach((s) => stepById.set(s.id, s));

  // 1. Calculate topological rank/depth for each step
  const depthMap: Record<string, number> = {};
  steps.forEach((s) => {
    if (!s.prerequisites || s.prerequisites.length === 0) {
      depthMap[s.id] = 0;
    }
  });

  for (let pass = 0; pass < 3; pass++) {
    steps.forEach((s, idx) => {
      if (s.prerequisites && s.prerequisites.length > 0) {
        const maxPrereqDepth = Math.max(
          ...s.prerequisites.map((pId) => depthMap[pId] ?? 0),
          0
        );
        depthMap[s.id] = Math.max(depthMap[s.id] ?? 0, maxPrereqDepth + 1);
      } else if (depthMap[s.id] === undefined) {
        depthMap[s.id] = Math.floor(idx / 2);
      }
    });
  }

  // Group steps by rank
  const rankBuckets: Record<number, ProcedureStep[]> = {};
  steps.forEach((step) => {
    const r = depthMap[step.id] ?? 0;
    if (!rankBuckets[r]) rankBuckets[r] = [];
    rankBuckets[r].push(step);
  });

  const cardWidth = 320;
  const cardHeight = 180;
  const colGap = 70;
  const rowGap = 45;
  const padX = 45;
  const padY = 45;

  const ranks = Object.keys(rankBuckets).map(Number);
  const totalCols = ranks.length > 0 ? Math.max(...ranks) + 1 : 1;
  const maxRows = Math.max(...Object.values(rankBuckets).map((arr) => arr.length), 1);

  const logicalWidth = padX * 2 + totalCols * cardWidth + (totalCols - 1) * colGap;
  const logicalHeight = padY * 2 + maxRows * cardHeight + (maxRows - 1) * rowGap;

  // Render at 3.0x ultra-high DPI resolution
  const scale = 3.0;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(logicalWidth * scale);
  canvas.height = Math.ceil(logicalHeight * scale);

  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Solid White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  // Position coordinates for each step
  const stepPositions = new Map<string, { x: number; y: number; rank: number }>();

  Object.entries(rankBuckets).forEach(([rankStr, rankSteps]) => {
    const rank = parseInt(rankStr, 10);
    const totalInRank = rankSteps.length;

    rankSteps.forEach((step, idxInRank) => {
      const colHeight = totalInRank * cardHeight + (totalInRank - 1) * rowGap;
      const startY = padY + (logicalHeight - padY * 2 - colHeight) / 2;
      const x = padX + rank * (cardWidth + colGap);
      const y = startY + idxInRank * (cardHeight + rowGap);

      stepPositions.set(step.id, { x, y, rank });
    });
  });

  // 1. Draw Connector Edges with Arrowheads (behind cards)
  const drawnEdges = new Set<string>();

  steps.forEach((step, stepIndex) => {
    const prereqs = step.prerequisites && step.prerequisites.length > 0
      ? step.prerequisites
      : stepIndex > 0 ? [steps[stepIndex - 1].id] : [];

    const targetPos = stepPositions.get(step.id);
    if (!targetPos) return;

    prereqs.forEach((prereqId) => {
      const edgeKey = `${prereqId}->${step.id}`;
      if (drawnEdges.has(edgeKey)) return;
      drawnEdges.add(edgeKey);

      const sourcePos = stepPositions.get(prereqId);
      if (!sourcePos) return;

      const prereqStep = stepById.get(prereqId);
      const isPrereqDone = prereqStep?.status === 'Completed';

      const startX = sourcePos.x + cardWidth;
      const startY = sourcePos.y + cardHeight / 2;
      const endX = targetPos.x;
      const endY = targetPos.y + cardHeight / 2;

      ctx.save();
      const edgeColor = isPrereqDone ? '#10B981' : '#94A3B8';
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 2.5;

      // Source connection dot
      ctx.fillStyle = edgeColor;
      ctx.beginPath();
      ctx.arc(startX, startY, 4, 0, Math.PI * 2);
      ctx.fill();

      if (isPrereqDone && step.status !== 'Completed') {
        ctx.setLineDash([6, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      if (Math.abs(startY - endY) < 5) {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX - 10, endY);
      } else {
        const midX = (startX + endX) / 2;
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(midX, startY, midX, endY, endX - 10, endY);
      }
      ctx.stroke();

      // Sharp Crisp Arrowhead at Target
      ctx.fillStyle = edgeColor;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 10, endY - 6);
      ctx.lineTo(endX - 10, endY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  });

  // 2. Draw Cards
  steps.forEach((step) => {
    const pos = stepPositions.get(step.id);
    if (!pos) return;

    const { x, y } = pos;
    const isCompleted = step.status === 'Completed';
    const isInProgress = step.status === 'In Progress';
    const incompletePrereqs = (step.prerequisites || []).filter((pId) => {
      const p = stepById.get(pId);
      return p && p.status !== 'Completed';
    });
    const isBlocked = incompletePrereqs.length > 0 && !isCompleted;

    let bgFill = '#FFFFFF';
    let borderColor = '#CBD5E1';
    let badgeBg = '#E2E8F0';
    let badgeText = '#334155';
    let statusText = 'Pending';
    let statusColor = '#64748B';

    if (isCompleted) {
      bgFill = '#F0FDF4';
      borderColor = '#10B981';
      badgeBg = '#10B981';
      badgeText = '#FFFFFF';
      statusText = 'Completed';
      statusColor = '#059669';
    } else if (isInProgress) {
      bgFill = '#FFFBEB';
      borderColor = '#F59E0B';
      badgeBg = '#F59E0B';
      badgeText = '#FFFFFF';
      statusText = 'In Progress';
      statusColor = '#D97706';
    } else if (isBlocked) {
      bgFill = '#FFF1F2';
      borderColor = '#F43F5E';
      badgeBg = '#F43F5E';
      badgeText = '#FFFFFF';
      statusText = 'Blocked';
      statusColor = '#E11D48';
    }

    // Card background & rounded border
    ctx.save();
    ctx.fillStyle = bgFill;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x, y, cardWidth, cardHeight, 16);
    ctx.fill();
    ctx.stroke();

    // Step Number Badge (Circle)
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.arc(x + 24, y + 24, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = badgeText;
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(step.stepNumber), x + 24, y + 24.5);

    // Category Label (top-right)
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const catText = (step.category || 'STATUTORY STAGE').toUpperCase();
    const truncatedCat = catText.length > 28 ? catText.slice(0, 26) + '...' : catText;
    ctx.fillText(truncatedCat, x + cardWidth - 18, y + 24);

    // Step Title (middle, multi-line wrap without clipping)
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const rawTitle = (step.title || '').replace(/^\d+\.\s*/, '');
    const { lines: titleLines, hasMultipleLines } = wrapText(ctx, rawTitle, cardWidth - 36, 2);

    titleLines.forEach((line, lIdx) => {
      ctx.fillText(line, x + 18, y + 48 + lIdx * 18);
    });

    // Department / Authority (subtext)
    ctx.fillStyle = '#475569';
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    const rawAuth = step.authority || step.department || 'Government Authority';
    const authText = rawAuth.length > 38 ? rawAuth.slice(0, 36) + '...' : rawAuth;
    const authY = y + (hasMultipleLines ? 88 : 72);
    ctx.fillText(authText, x + 18, authY);

    // Processing Time & Documents count
    ctx.fillStyle = '#64748B';
    ctx.font = '400 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    const docCount = (step.documents || []).length;
    const metaText = `${step.processingTime || '1-2 weeks'}  •  ${docCount} Required Doc${docCount === 1 ? '' : 's'}`;
    const metaY = y + (hasMultipleLines ? 106 : 90);
    ctx.fillText(metaText, x + 18, metaY);

    // Divider Line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 130);
    ctx.lineTo(x + cardWidth - 18, y + 130);
    ctx.stroke();

    // Footer: Status Icon Dot + Text (left)
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(x + 26, y + 154, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(statusText, x + 36, y + 154);

    // Footer: Fee (right)
    ctx.fillStyle = '#1B4D3E';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const feeText = step.fee?.amount ? (typeof step.fee.amount === 'string' ? step.fee.amount : `₹${step.fee.amount}`) : 'Free';
    const truncatedFee = feeText.length > 24 ? feeText.slice(0, 22) + '...' : feeText;
    ctx.fillText(truncatedFee, x + cardWidth - 18, y + 154);

    ctx.restore();
  });

  return canvas;
}

/**
 * Generates the official DishaSaathi visual roadmap graph PDF.
 * Page 1: Ultra-high resolution visual dependency flowchart graph.
 * Page 2: Step-by-step statutory details, document checklists & official portal links.
 */
export const generateRoadmapPdf = (journey: CivicJourney, citizenName: string = 'Citizen') => {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

    // ==========================================
    // PAGE 1: VISUAL DEPENDENCY ROADMAP GRAPH
    // ==========================================

    // Top Header Banner (24mm tall)
    pdf.setFillColor(27, 77, 62); // #1B4D3E
    pdf.rect(0, 0, pdfWidth, 24, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text('DISHASAATHI — OFFICIAL CIVIC ROADMAP GRAPH', 12, 10);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(200, 230, 215);
    pdf.text(
      `${journey.title}   |   Jurisdiction: ${journey.location || 'India'}   |   Category: ${journey.category}`,
      12,
      17
    );

    // Top Right Metric Pill
    const completedStepsCount = (journey.steps || []).filter((s) => s.status === 'Completed').length;
    const totalStepsCount = (journey.steps || []).length || journey.totalSteps || 1;
    const pct = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

    pdf.setFillColor(38, 98, 80);
    pdf.roundedRect(pdfWidth - 76, 6, 64, 12, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${completedStepsCount}/${totalStepsCount} Steps Done (${pct}%)`, pdfWidth - 44, 13.5, { align: 'center' });

    // Render Canvas Graph
    const canvas = generateHighResGraphCanvas(journey);
    const imgData = canvas.toDataURL('image/png', 1.0);

    const marginX = 10;
    const topReserved = 26;
    const bottomReserved = 20;
    const availableWidth = pdfWidth - marginX * 2; // 277mm
    const availableHeight = pdfHeight - topReserved - bottomReserved; // 164mm

    let imgWidth = availableWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > availableHeight) {
      imgHeight = availableHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const xOffset = marginX + (availableWidth - imgWidth) / 2;
    const yOffset = topReserved + (availableHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');

    // Bottom Legend & Verification Footer Bar (11mm tall)
    const footerY = pdfHeight - 16;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(10, footerY, pdfWidth - 20, 11, 2, 2, 'FD');

    // Legend Badges
    let legendX = 16;
    const legendY = footerY + 6.5;

    // Completed
    pdf.setFillColor(16, 185, 129);
    pdf.circle(legendX, legendY - 1, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Completed', legendX + 4, legendY);
    legendX += 28;

    // In Progress
    pdf.setFillColor(245, 158, 11);
    pdf.circle(legendX, legendY - 1, 2, 'F');
    pdf.text('In Progress', legendX + 4, legendY);
    legendX += 30;

    // Pending
    pdf.setFillColor(148, 163, 184);
    pdf.circle(legendX, legendY - 1, 2, 'F');
    pdf.text('Pending', legendX + 4, legendY);
    legendX += 26;

    // Blocked
    pdf.setFillColor(244, 63, 94);
    pdf.circle(legendX, legendY - 1, 2, 'F');
    pdf.text('Blocked Prerequisite', legendX + 4, legendY);

    // Gazette statement & date on right
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `Generated for: ${citizenName}  •  Official Gazette Grounded Flow  •  ${new Date().toLocaleDateString('en-IN')}`,
      pdfWidth - 16,
      legendY,
      { align: 'right' }
    );

    // ==========================================
    // PAGE 2: DETAILED STEP PROCEDURE CHECKLIST
    // ==========================================
    pdf.addPage('a4', 'portrait');
    const pWidth = 210;
    const pHeight = 297;
    const pMargin = 14;
    let y = pMargin;

    // Top Green Header
    pdf.setFillColor(27, 77, 62);
    pdf.rect(0, 0, pWidth, 24, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    pdf.text('STEP-BY-STEP STATUTORY PROCEDURE FLOW', pMargin, 11);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(200, 230, 215);
    pdf.text(`${journey.title}  •  Verified Legal Checklists & Portals`, pMargin, 17);

    y = 32;

    (journey.steps || []).forEach((step) => {
      if (y > pHeight - 32) {
        pdf.addPage('a4', 'portrait');
        y = pMargin;
        pdf.setFillColor(27, 77, 62);
        pdf.rect(0, 0, pWidth, 12, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${journey.title} (Cont.)`, pMargin, 8);
        y += 18;
      }

      const cleanTitle = (step.title || 'Step').replace(/^\d+\.\s*/, '');
      const isCompleted = step.status === 'Completed';

      pdf.setFillColor(isCompleted ? 245 : 255, isCompleted ? 250 : 255, isCompleted ? 247 : 255);
      pdf.setDrawColor(isCompleted ? 180 : 220, isCompleted ? 220 : 225, isCompleted ? 200 : 220);
      pdf.roundedRect(pMargin, y, pWidth - (pMargin * 2), 24, 2, 2, 'FD');

      // Step Number Circle
      pdf.setFillColor(isCompleted ? 27 : 230, isCompleted ? 77 : 235, isCompleted ? 62 : 232);
      pdf.circle(pMargin + 6, y + 8, 4, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(isCompleted ? 255 : 40, isCompleted ? 255 : 40, isCompleted ? 255 : 40);
      pdf.text(`${step.stepNumber}`, pMargin + 5, y + 10);

      // Title & Status
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(17, 38, 31);
      pdf.text(cleanTitle, pMargin + 13, y + 7);

      pdf.setFontSize(8);
      if (isCompleted) {
        pdf.setTextColor(16, 128, 92);
        pdf.text('COMPLETED', pWidth - pMargin - 26, y + 7);
      } else {
        pdf.setTextColor(180, 100, 20);
        pdf.text(`[${(step.status || 'PENDING').toUpperCase()}]`, pWidth - pMargin - 26, y + 7);
      }

      // Department & Fee
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(80, 95, 88);
      const feeStr = step.fee?.amount ? (typeof step.fee.amount === 'string' ? step.fee.amount : `₹${step.fee.amount}`) : 'Free';
      pdf.text(`Authority: ${step.authority || step.department || 'Municipal Authority'}   |   Time: ${step.processingTime || '1-2 weeks'}   |   Fee: ${feeStr}`, pMargin + 13, y + 13);

      // Documents
      const docNames = (step.documents || []).map((d) => d.name).join(', ');
      const truncatedDocs = docNames.length > 85 ? docNames.substring(0, 82) + '...' : docNames;
      pdf.text(`Required Documents: ${truncatedDocs || 'None specified'}`, pMargin + 13, y + 18);

      // Portal Link
      if (step.applicationUrl) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(27, 77, 62);
        const urlText = `Portal: ${step.applicationUrl}`;
        pdf.text(urlText.length > 90 ? urlText.substring(0, 87) + '...' : urlText, pMargin + 13, y + 22);
      }

      y += 28;
    });

    const safeFilename = `${journey.title.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap_Graph.pdf`;
    pdf.save(safeFilename);
  } catch (err) {
    console.error('Failed to generate high-resolution visual roadmap PDF', err);
  }
};
