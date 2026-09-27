import React, { useMemo, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Layers,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import { CivicJourney, ProcedureStep } from '../types';
import { generateRoadmapPdf } from '../utils/pdfGenerator';

interface ReactFlowGraphModalProps {
  journey: CivicJourney;
  onClose: () => void;
  onSelectStep: (step: ProcedureStep) => void;
}

// Custom Civic Procedure Node Component
const ProcedureNodeComponent = ({ data }: { data: any }) => {
  const { step, isBlocked, isCompleted, isInProgress, onSelect } = data;

  let borderColor = 'border-slate-300 dark:border-slate-700';
  let bgColor = 'bg-white dark:bg-[#0D1A16]';
  let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  let statusIcon = <Clock className="w-3.5 h-3.5 text-slate-400" />;
  let statusText = 'Pending';

  if (isCompleted) {
    borderColor = 'border-emerald-600 dark:border-emerald-500';
    bgColor = 'bg-emerald-50/95 dark:bg-emerald-950/40';
    badgeColor = 'bg-emerald-600 text-white';
    statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    statusText = 'Completed';
  } else if (isInProgress) {
    borderColor = 'border-amber-500 dark:border-amber-400';
    bgColor = 'bg-amber-50/95 dark:bg-amber-950/40';
    badgeColor = 'bg-amber-500 text-white';
    statusIcon = <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />;
    statusText = 'In Progress';
  } else if (isBlocked) {
    borderColor = 'border-rose-400 dark:border-rose-700';
    bgColor = 'bg-rose-50/70 dark:bg-rose-950/30';
    badgeColor = 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200';
    statusIcon = <Lock className="w-3.5 h-3.5 text-rose-500" />;
    statusText = 'Blocked';
  }

  const cleanTitle = (step.title || '').replace(/^\d+\.\s*/, '');
  const authorityText = step.authority || step.department || 'Government Authority';

  return (
    <div
      onClick={() => onSelect(step)}
      className={`relative w-[280px] p-4 rounded-2xl border-2 shadow-md hover:shadow-xl transition-all cursor-pointer select-none ${borderColor} ${bgColor}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-500 !border-2 !border-white dark:!border-slate-900"
      />
      
      {step.hasUpdate && (
        <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <AlertTriangle className="w-2.5 h-2.5" /> Updated
        </span>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeColor} shrink-0`}>
          {step.stepNumber}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[190px] text-right">
          {step.category || 'Statutory Stage'}
        </span>
      </div>

      <h4 
        className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight mb-1 truncate"
        title={cleanTitle}
      >
        {cleanTitle}
      </h4>

      <p 
        className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight truncate mb-3"
        title={authorityText}
      >
        {authorityText}
      </p>

      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          {statusIcon}
          <span>{statusText}</span>
        </span>
        <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">
          {step.fee?.amount || 'Free'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-600 !border-2 !border-white dark:!border-slate-900"
      />
    </div>
  );
};

export const ReactFlowGraphModal: React.FC<ReactFlowGraphModalProps> = ({
  journey,
  onClose,
  onSelectStep
}) => {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const nodeTypes = useMemo(() => ({
    procedureNode: ProcedureNodeComponent
  }), []);

  // Compute hierarchical topological ranks & clean simplified edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const steps = journey.steps || [];

    // 1. Calculate topological rank/depth for each step
    const depthMap: Record<string, number> = {};
    const stepById = new Map<string, ProcedureStep>();
    steps.forEach((s) => stepById.set(s.id, s));

    // Multi-pass depth resolution
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
          // Fallback sequential rank based on index if no explicit graph
          depthMap[s.id] = Math.floor(idx / 2);
        }
      });
    }

    // Group nodes by their rank/column
    const rankBuckets: Record<number, ProcedureStep[]> = {};
    steps.forEach((step) => {
      const r = depthMap[step.id] ?? 0;
      if (!rankBuckets[r]) rankBuckets[r] = [];
      rankBuckets[r].push(step);
    });

    // 2. Position nodes cleanly with generous spacing
    const colWidth = 370;
    const rowHeight = 180;

    Object.entries(rankBuckets).forEach(([rankStr, rankSteps]) => {
      const rank = parseInt(rankStr, 10);
      const totalInRank = rankSteps.length;

      rankSteps.forEach((step, idxInRank) => {
        const isCompleted = step.status === 'Completed';
        const isInProgress = step.status === 'In Progress';
        const incompletePrereqs = (step.prerequisites || []).filter((pId) => {
          const p = stepById.get(pId);
          return p && p.status !== 'Completed';
        });
        const isBlocked = incompletePrereqs.length > 0 && !isCompleted;

        // Center vertically if there are fewer nodes in this column
        const yOffset = 60 + idxInRank * rowHeight + (totalInRank === 1 ? 40 : 0);

        nodes.push({
          id: step.id,
          type: 'procedureNode',
          position: {
            x: 60 + rank * colWidth,
            y: yOffset
          },
          data: {
            step,
            isCompleted,
            isInProgress,
            isBlocked,
            onSelect: onSelectStep
          }
        });
      });
    });

    // 3. Build simplified, non-intersecting edges
    // Deduplicate and avoid redundant skip-level edges if a direct sequential path exists
    const directPrereqSet = new Set<string>();

    steps.forEach((step, stepIndex) => {
      const explicitPrereqs = step.prerequisites || [];

      if (explicitPrereqs.length > 0) {
        explicitPrereqs.forEach((prereqId) => {
          const edgeKey = `${prereqId}->${step.id}`;
          if (!directPrereqSet.has(edgeKey)) {
            directPrereqSet.add(edgeKey);
            const prereqStep = stepById.get(prereqId);
            const isPrereqCompleted = prereqStep?.status === 'Completed';
            const isTargetCompleted = step.status === 'Completed';

            edges.push({
              id: `edge-${prereqId}-${step.id}`,
              source: prereqId,
              target: step.id,
              type: 'smoothstep',
              pathOptions: { borderRadius: 16 },
              animated: isPrereqCompleted && !isTargetCompleted,
              style: {
                stroke: isPrereqCompleted ? '#10B981' : '#94A3B8',
                strokeWidth: isPrereqCompleted ? 2.5 : 2
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: isPrereqCompleted ? '#10B981' : '#94A3B8',
                width: 16,
                height: 16
              }
            });
          }
        });
      } else if (stepIndex > 0) {
        // Fallback sequential edge to previous step if no explicit prereqs
        const prevStep = steps[stepIndex - 1];
        const edgeKey = `${prevStep.id}->${step.id}`;
        if (!directPrereqSet.has(edgeKey)) {
          directPrereqSet.add(edgeKey);
          const isPrevCompleted = prevStep.status === 'Completed';
          const isCurrCompleted = step.status === 'Completed';

          edges.push({
            id: `edge-${prevStep.id}-${step.id}`,
            source: prevStep.id,
            target: step.id,
            type: 'smoothstep',
            pathOptions: { borderRadius: 16 },
            animated: isPrevCompleted && !isCurrCompleted,
            style: {
              stroke: isPrevCompleted ? '#10B981' : '#CBD5E1',
              strokeWidth: 2
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isPrevCompleted ? '#10B981' : '#94A3B8',
              width: 16,
              height: 16
            }
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [journey, onSelectStep]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

// Text Wrapping Helper for Canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number = 2
): { lines: string[]; hasMultipleLines: boolean } {
  const words = (text || '').trim().split(/\s+/);
  if (words.length === 0 || words[0] === '') return { lines: [''], hasMultipleLines: false };

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
        // Last line allowed - truncate with ellipsis if necessary
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

  // Render at 3.0x ultra-high DPI resolution (crisp vectors & typography)
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
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 11, endY - 6);
      ctx.lineTo(endX - 11, endY + 6);
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
    const metaText = `⏱ ${step.processingTime || '1-2 weeks'}  •  📄 ${docCount} Required Doc${docCount === 1 ? '' : 's'}`;
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
    const feeText = step.fee?.amount || 'Free';
    const truncatedFee = feeText.length > 24 ? feeText.slice(0, 22) + '...' : feeText;
    ctx.fillText(truncatedFee, x + cardWidth - 18, y + 154);

    ctx.restore();
  });

  return canvas;
}

  // PDF Export Handler
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // 1. Generate ultra-crisp unclipped 2D vector canvas
      const canvas = generateHighResGraphCanvas(journey);
      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

      // Top Green Header Banner (24mm tall)
      pdf.setFillColor(27, 77, 62); // #1B4D3E
      pdf.rect(0, 0, pdfWidth, 24, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('DISHASAATHI — VISUAL CIVIC DEPENDENCY GRAPH', 12, 10);

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
      const totalStepsCount = (journey.steps || []).length;
      const pct = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

      pdf.setFillColor(38, 98, 80);
      pdf.roundedRect(pdfWidth - 76, 6, 64, 12, 2, 2, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${completedStepsCount}/${totalStepsCount} Steps Done (${pct}%)`, pdfWidth - 44, 13.5, { align: 'center' });

      // Fit the graph image cleanly into the landscape A4 page
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

      // Bottom Legend & Verification Footer Bar (14mm tall)
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
        `Official Gazette Source-Grounded Flow  •  Generated: ${new Date().toLocaleDateString('en-IN')}`,
        pdfWidth - 16,
        legendY,
        { align: 'right' }
      );

      const safeFilename = `${journey.title.replace(/[^a-zA-Z0-9]/g, '_')}_Visual_Graph.pdf`;
      pdf.save(safeFilename);
    } catch (err) {
      console.warn('Direct canvas PDF export fallback to vector report', err);
      generateRoadmapPdf(journey, 'Citizen');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full h-[90vh] max-w-7xl bg-white dark:bg-[#0D1A16] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E3B32] flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#10241E] border-b border-slate-200 dark:border-[#1E3B32] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2ED] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center justify-center font-bold shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Visual Dependency Graph — {journey.title}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {journey.completedSteps}/{journey.totalSteps} Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Official source-grounded procedure graph with simplified non-crossing dependency pathways
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Download Graph as PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              title="Download high-resolution graph diagram as PDF"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Graph PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-[#1E3B32] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Close Graph View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div ref={graphContainerRef} className="flex-1 w-full h-full bg-[#F8FAFC] dark:bg-[#08120F]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.35}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: 'smoothstep'
            }}
          >
            <Background color="#CBD5E1" gap={24} size={1} />
            <Controls className="bg-white dark:bg-[#0D1A16] border border-slate-200 dark:border-[#1E3B32] shadow-md rounded-xl p-1" />
            <MiniMap
              nodeColor={(n) => {
                if (n.data?.isCompleted) return '#10B981';
                if (n.data?.isInProgress) return '#F59E0B';
                if (n.data?.isBlocked) return '#E11D48';
                return '#94A3B8';
              }}
              className="bg-white dark:bg-[#0D1A16] border border-slate-200 dark:border-[#1E3B32] rounded-xl shadow-md"
            />
          </ReactFlow>
        </div>

        {/* Legend Footer */}
        <div className="px-6 py-3 bg-white dark:bg-[#0D1A16] border-t border-slate-200 dark:border-[#1E3B32] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-4 shrink-0 transition-colors">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Completed
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> In Progress
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span> Pending
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span> Blocked Prerequisite
            </span>
          </div>

          <div className="text-slate-500 dark:text-slate-400 italic text-[11px]">
            Click any procedure node to inspect documents, official gazette sources, and dependency reasoning.
          </div>
        </div>
      </div>
    </div>
  );
};

