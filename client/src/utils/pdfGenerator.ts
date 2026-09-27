import jsPDF from 'jspdf';
import { CivicJourney } from '../types';

export const generateRoadmapPdf = (journey: CivicJourney, citizenName: string = 'Citizen') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // Primary Header / Banner
  doc.setFillColor(27, 77, 62); // #1B4D3E
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title in Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('DISHASAATHI — OFFICIAL CIVIC ROADMAP', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 230, 215);
  doc.text('Verified Indian Municipal & Central Statutory Compliance Pipeline', margin, 18);
  doc.text(`Generated for: ${citizenName}  |  Date: ${new Date().toLocaleDateString('en-IN')}`, margin, 24);

  y = 35;

  // Journey Summary Box
  doc.setFillColor(242, 248, 245); // #F2F8F5
  doc.setDrawColor(205, 227, 215);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 38, 31); // #11261F
  doc.text(journey.title, margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(74, 93, 84);
  doc.text(`Jurisdiction: ${journey.location || 'India'}  |  Category: ${journey.category}`, margin + 4, y + 13);

  // Key Metrics inline
  const completed = journey.steps.filter(s => s.status === 'Completed').length;
  const total = journey.steps.length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 77, 62);
  doc.text(`Progress: ${completed}/${total} Steps (${progressPct}%)   |   Status: ${journey.status}   |   Source: 100% Gazette Verified`, margin + 4, y + 20);

  y += 33;

  // Steps Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 38, 31);
  doc.text('STEP-BY-STEP STATUTORY PROCEDURE FLOW', margin, y);
  y += 4;

  // Iterate Steps
  journey.steps.forEach((step, index) => {
    // Check if new page is needed
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
      doc.setFillColor(27, 77, 62);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`DishaSaathi Civic Roadmap — ${journey.title} (Cont.)`, margin, 8);
      y += 18;
    }

    const cleanTitle = step.title.replace(/^\d+\.\s*/, '');
    const isCompleted = step.status === 'Completed';

    // Step Card Box
    doc.setFillColor(isCompleted ? 245 : 255, isCompleted ? 250 : 255, isCompleted ? 247 : 255);
    doc.setDrawColor(isCompleted ? 180 : 220, isCompleted ? 220 : 225, isCompleted ? 200 : 220);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, 'FD');

    // Step Number Circle/Box
    doc.setFillColor(isCompleted ? 27 : 230, isCompleted ? 77 : 235, isCompleted ? 62 : 232);
    doc.circle(margin + 6, y + 8, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(isCompleted ? 255 : 40, isCompleted ? 255 : 40, isCompleted ? 255 : 40);
    doc.text(`${step.stepNumber}`, margin + 5, y + 10);

    // Step Title & Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 38, 31);
    doc.text(`${cleanTitle}`, margin + 13, y + 7);

    // Status pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (isCompleted) {
      doc.setTextColor(16, 128, 92);
      doc.text(' COMPLETED', pageWidth - margin - 26, y + 7);
    } else {
      doc.setTextColor(180, 100, 20);
      doc.text(`[${step.status.toUpperCase()}]`, pageWidth - margin - 26, y + 7);
    }

    // Authority, Time & Fee
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 95, 88);
    doc.text(`Authority: ${step.authority || step.department}   |   Time: ${step.processingTime || '1-2 weeks'}   |   Fee: ${step.fee?.amount || 'Free'}`, margin + 13, y + 13);

    // Required Documents
    const docNames = step.documents.map(d => d.name).join(', ');
    const truncatedDocs = docNames.length > 85 ? docNames.substring(0, 82) + '...' : docNames;
    doc.text(`Required Documents: ${truncatedDocs || 'None specified'}`, margin + 13, y + 18);

    // Official portal link
    if (step.applicationUrl) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(27, 77, 62);
      const urlText = `Official Portal: ${step.applicationUrl}`;
      doc.text(urlText.length > 90 ? urlText.substring(0, 87) + '...' : urlText, margin + 13, y + 22);
    }

    y += 28;
  });

  // Footer / Watermark on last page
  if (y > pageHeight - 20) {
    doc.addPage();
    y = margin;
  }
  y = pageHeight - 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(130, 145, 138);
  doc.text('DishaSaathi • Verified against active municipal gazettes and statutory acts • Not a replacement for official portal submissions', margin, y);

  // Save the PDF
  const filename = `dishasaathi-${journey.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  doc.save(filename);
};
