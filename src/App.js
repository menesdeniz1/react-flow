import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 5 },
    data: { label: 'Custom Node' },
  },
  {
    id: 'subflow-node',
    type: 'default',
    position: { x: 400, y: 150 },
    data: { label: 'Subflow' },
    style: {
      background: '#ffcc00',
      padding: '10px',
      borderRadius: '5px',
      width: 300,  // Add fixed width for parent
      height: 200, // Add fixed height for parent
    },
    className: 'parent-node', // Add class for styling
  },
  // Add an initial child node
  {
    id: 'child-1',
    type: 'custom',
    position: { x: 50, y: 50 },
    data: { label: 'Child Node 1' },
    parentNode: 'subflow-node',
    extent: 'parent',
  }
];

const initialEdges = [];

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onAdd = useCallback(() => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'custom',
      // Position is relative to parent node
      position: { x: Math.random() * 200, y: Math.random() * 100 },
      data: { 
        label: `Child Node ${nodes.length + 1}`,
        width: 100,
        height: 50,
        color: '#ff0072',
        background: '#ffffff'
      },
      parentNode: 'subflow-node', // Set parent node
      extent: 'parent', // Constrain to parent boundaries
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { 
            ...params, 
            type: 'custom', 
            data: { label: `${params.source} ➔ ${params.target}` } 
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDeleteNode = useCallback(() => {
    setNodes((nds) => nds.slice(0, -1));
  }, [setNodes]);

  const onDeleteEdge = useCallback(() => {
    setEdges((eds) => eds.slice(0, -1));
  }, [setEdges]);

  const onSelectionChange = useCallback((elements) => {
    console.log('Seçilenler:', elements);
  }, []);

  // Add CSS to your stylesheet
  const styles = {
    parentNode: {
      border: '2px solid #000',
      borderRadius: '5px',
      padding: '20px',
    },
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <style>
        {`
          .parent-node {
            border: 2px solid #000;
            border-radius: 5px;
            padding: 20px;
          }
        `}
      </style>
      <button onClick={onAdd} style={{ position: 'absolute', zIndex: 10 }}>
        Yeni Özel Node Ekle
      </button>
      <button onClick={onDeleteNode} style={{ position: 'absolute', top: 40, zIndex: 10 }}>
        Node'u Sil
      </button>
      <button onClick={onDeleteEdge} style={{ position: 'absolute', top: 80, zIndex: 10 }}>
        Bağlantıyı Sil
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onSelectionChange={onSelectionChange}
        selectionMode="partial"
        fitView
      >
        <MiniMap
          nodeColor={(node) => (node.type === 'custom' ? '#ff0072' : '#1a192b')}
          nodeStrokeWidth={3}
          style={{ height: 100 }}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;