
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
  BackgroundVariant,
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

  // Sync nodes from context to local state only when context changes
  React.useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes, setLocalNodes]);

  // Sync edges from context to local state only when context changes
  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  // Sync local state changes back to context (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNodes(localNodes);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [localNodes, setNodes]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEdges(localEdges);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [localEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        source: params.source!,
        target: params.target!
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
