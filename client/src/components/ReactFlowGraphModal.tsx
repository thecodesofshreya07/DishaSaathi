import React, { useMemo } from 'react';
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
  Layers
} from 'lucide-react';
import { CivicJourney, ProcedureStep } from '../types';

interface ReactFlowGraphModalProps {
  journey: CivicJourney;
  onClose: () => void;
  onSelectStep: (step: ProcedureStep) => void;
}

// Custom Civic Procedure Node Component
const ProcedureNodeComponent = ({ data }: { data: any }) => {
  const { step, isBlocked, isCompleted, isInProgress, onSelect } = data;

  let borderColor = 'border-slate-300';
  let bgColor = 'bg-white';
  let badgeColor = 'bg-slate-100 text-slate-600';
  let statusIcon = <Clock className="w-3.5 h-3.5 text-slate-400" />;
  let statusText = 'Pending';

  if (isCompleted) {
    borderColor = 'border-emerald-500';
    bgColor = 'bg-emerald-50/90';
    badgeColor = 'bg-emerald-600 text-white';
    statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    statusText = 'Completed';
  } else if (isInProgress) {
    borderColor = 'border-amber-500';
    bgColor = 'bg-amber-50/90';
    badgeColor = 'bg-amber-500 text-white';
    statusIcon = <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />;
    statusText = 'In Progress';
  } else if (isBlocked) {
    borderColor = 'border-rose-300';
    bgColor = 'bg-slate-50';
    statusIcon = <Lock className="w-3.5 h-3.5 text-rose-500" />;
    statusText = 'Blocked';
  }

  return (
    <div
      onClick={() => onSelect(step)}
      className={`relative w-64 p-3.5 rounded-2xl border-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${borderColor} ${bgColor}`}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-slate-600" />
      
      {step.hasUpdate && (
        <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <AlertTriangle className="w-2.5 h-2.5" /> Updated
        </span>
      )}

      <div className="flex items-center justify-between mb-1.5">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeColor}`}>
          {step.stepNumber}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {step.category}
        </span>
      </div>

      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
        {step.title}
      </h4>

      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
        {step.department}
      </p>

      <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-slate-700">
          {statusIcon}
          <span>{statusText}</span>
        </span>
        <span className="font-extrabold text-slate-900">
          {step.fee.amount}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-emerald-600" />
    </div>
  );
};

export const ReactFlowGraphModal: React.FC<ReactFlowGraphModalProps> = ({
  journey,
  onClose,
  onSelectStep
}) => {
  const nodeTypes = useMemo(() => ({
    procedureNode: ProcedureNodeComponent
  }), []);
  // Convert journey steps to React Flow Nodes & Edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Layout configuration: 4 columns x 2 rows
    const colWidth = 320;
    const rowHeight = 180;

    journey.steps.forEach((step, idx) => {
      const row = Math.floor(idx / 4);
      const col = idx % 4;

      const isCompleted = step.status === 'Completed';
      const isInProgress = step.status === 'In Progress';
      const incompletePrereqs = step.prerequisites.filter((pId) => {
        const p = journey.steps.find((s) => s.id === pId);
        return p && p.status !== 'Completed';
      });
      const isBlocked = incompletePrereqs.length > 0 && !isCompleted;

      nodes.push({
        id: step.id,
        type: 'procedureNode',
        position: { x: 50 + col * colWidth, y: 60 + row * rowHeight },
        data: {
          step,
          isCompleted,
          isInProgress,
          isBlocked,
          onSelect: onSelectStep
        }
      });

      // Construct dependency edges
      step.prerequisites.forEach((prereqId) => {
        const prereqStep = journey.steps.find((s) => s.id === prereqId);
        const isPrereqCompleted = prereqStep?.status === 'Completed';

        edges.push({
          id: `edge-${prereqId}-${step.id}`,
          source: prereqId,
          target: step.id,
          animated: isPrereqCompleted && !isCompleted,
          style: {
            stroke: isPrereqCompleted ? '#16805C' : '#94A3B8',
            strokeWidth: 2.5
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isPrereqCompleted ? '#16805C' : '#94A3B8'
          }
        });
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [journey, onSelectStep]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full h-[90vh] max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                DishaSaathi Visual Dependency Graph — {journey.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Official source-grounded procedure graph with multi-step prerequisites and change indicators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 w-full h-full bg-[#F8FAFC]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#CBD5E1" gap={20} size={1} />
            <Controls className="bg-white border border-slate-200 shadow-md rounded-xl p-1" />
            <MiniMap
              nodeColor={(n) => {
                if (n.data?.isCompleted) return '#16805C';
                if (n.data?.isInProgress) return '#F59E0B';
                if (n.data?.isBlocked) return '#E11D48';
                return '#94A3B8';
              }}
              className="bg-white border border-slate-200 rounded-xl shadow-md"
            />
          </ReactFlow>
        </div>

        {/* Legend Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Completed
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> In Progress
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-slate-300"></span> Pending
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span> Blocked Prerequisite
            </span>
          </div>

          <div className="text-slate-500 italic">
            Click any procedure node to inspect documents, official gazette sources, and dependency reasoning.
          </div>
        </div>
      </div>
    </div>
  );
};
