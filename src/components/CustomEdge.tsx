
import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps
} from '@xyflow/react';
import { X, Plus } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
}) => {
  const { setEdges } = useReactFlow();
  const { setPendingConnection, nodes, setSelectedNode } = useWorkflow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onDeleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const onAddNode = () => {
    // First delete the current edge
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    
    // Find the source node to get its position
    const sourceNode = nodes.find(node => node.id === source);
    if (!sourceNode) return;

    // Set up pending connection from the source node to trigger node palette
    const connectionData = {
      sourceNodeId: source,
      sourcePosition: { x: sourceNode.position.x + 250, y: sourceNode.position.y }
    };
    
    console.log('Setting pending connection from edge plus:', connectionData);
    setPendingConnection(connectionData);
    setSelectedNode(null);
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: isHovered ? '#6B7280' : '#9CA3AF', 
          strokeWidth: 2 
        }}
      />
      
      {/* Invisible hover area around the edge path */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Only render our custom buttons when hovered */}
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <div className="flex gap-1 pointer-events-auto">
              <button
                className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors"
                onClick={onAddNode}
                title="Add node"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
              <button
                className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors"
                onClick={onDeleteEdge}
                title="Delete connection"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
