
import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps
} from '@xyflow/react';
import { X, Plus } from 'lucide-react';

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
}) => {
  const { setEdges, setNodes } = useReactFlow();
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
    // Add a new action node in the middle of the edge
    const newNodeId = `action-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'action',
      position: { x: labelX - 75, y: labelY - 25 },
      data: {
        label: 'Action',
        config: { operation: 'create' }
      }
    };

    setNodes((nodes) => [...nodes, newNode]);
    
    // Update edges to connect through the new node
    setEdges((edges) => {
      const currentEdge = edges.find(edge => edge.id === id);
      if (!currentEdge) return edges;
      
      return edges
        .filter(edge => edge.id !== id)
        .concat([
          {
            id: `edge-${currentEdge.source}-${newNodeId}`,
            source: currentEdge.source,
            target: newNodeId,
            type: 'smoothstep',
            style: { stroke: '#9CA3AF' }
          },
          {
            id: `edge-${newNodeId}-${currentEdge.target}`,
            source: newNodeId,
            target: currentEdge.target,
            type: 'smoothstep',
            style: { stroke: '#9CA3AF' }
          }
        ]);
    });
  };

  return (
    <>
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
      
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ ...style, stroke: isHovered ? '#6B7280' : '#9CA3AF', strokeWidth: 2 }}
      />
      
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div 
            className={`flex gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <button
              className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs transition-colors shadow-md"
              onClick={onAddNode}
              title="Add node"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors shadow-md"
              onClick={onDeleteEdge}
              title="Delete connection"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
