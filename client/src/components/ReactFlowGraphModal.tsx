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
  Download,
  FileCheck
} from 'lucide-react';
import html2canvas from 'html2canvas';
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

  let borderColor = 'border-slate-200 dark:border-slate-700';
  let bgColor = 'bg-white dark:bg-[#0D1A16]';
  let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
  let statusIcon = <Clock className="w-3.5 h-3.5 text-slate-400" />;
  let statusText = 'Pending';

  if (isCompleted) {
    borderColor = 'border-emerald-500 dark:border-emerald-400';
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

  return (
    <div
      onClick={() => onSelect(step)}
      className={`relative w-64 p-3.5 rounded-2xl border-2 shadow-md hover:shadow-xl transition-all cursor-pointer select-none ${borderColor} ${bgColor}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-500 !border-2 !border-white dark:!border-slate-900"
      />
      
      {step.hasUpdate && (
        <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <AlertTriangle className="w-2.5 h-2.5" /> Updated
        </span>
      )}

      <div className="flex items-center justify-between mb-1.5">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeColor}`}>
          {step.stepNumber}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {step.category || 'Statutory Stage'}
        </span>
      </div>

      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1">
        {step.title.replace(/^\d+\.\s*/, '')}
      </h4>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
        {step.authority || step.department}
      </p>

      <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          {statusIcon}
          <span>{statusText}</span>
        </span>
        <span className="font-extrabold text-[#1B4D3E] dark:text-[#6EE7B7]">
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
    const colWidth = 340;
    const rowHeight = 170;

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

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // PDF Export Handler
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      if (graphContainerRef.current) {
        // High-resolution screenshot of the graph canvas
        const canvas = await html2canvas(graphContainerRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#F8FAFC',
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Top Banner
        pdf.setFillColor(27, 77, 62); // #1B4D3E
        pdf.rect(0, 0, pdfWidth, 22, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(255, 255, 255);
        pdf.text('DISHASAATHI — VISUAL CIVIC DEPENDENCY GRAPH', 12, 10);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(200, 230, 215);
        pdf.text(
          `${journey.title}  |  Location: ${journey.location || 'India'}  |  Generated: ${new Date().toLocaleDateString('en-IN')}`,
          12,
          16
        );

        // Calculate aspect ratio for image
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const finalHeight = Math.min(imgHeight, pdfHeight - 32);

        pdf.addImage(imgData, 'PNG', 10, 26, imgWidth, finalHeight);

        const safeFilename = `${journey.title.replace(/[^a-zA-Z0-9]/g, '_')}_Visual_Graph.pdf`;
        pdf.save(safeFilename);
      } else {
        generateRoadmapPdf(journey, 'Citizen');
      }
    } catch (err) {
      console.warn('Canvas PDF export fallback to vector report', err);
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

