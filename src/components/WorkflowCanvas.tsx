
import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflow } from '../context/WorkflowContext';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import WebhookNode from './nodes/WebhookNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  webhook: WebhookNode,
  email: ActionNode,
  database: ActionNode,
  api: ActionNode
};

const WorkflowCanvas = () => {
  const { nodes, edges, setNodes, setEdges, setSelectedNode } = useWorkflow();
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  React.useEffect(() => {
    setNodes(localNodes);
  }, [localNodes, setNodes]);

  React.useEffect(() => {
    setEdges(localEdges);
  }, [localEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true
      };
      setLocalEdges((eds) => addEdge(newEdge, eds));
    },
    [setLocalEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-50"
      >
        <Background variant="dots" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
