import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
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
      id: (nodes.length + 1).toString(),
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: `Custom Node ${nodes.length + 1}`,
        width: Math.random() * 100 + 100,
        height: Math.random() * 50 + 50,
        color: '#ff0072',
        background: '#ffcc00'
      },
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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
      >
        {/* MiniMap buraya taşındı */}
        <MiniMap
          nodeColor={(node) => (node.type === 'custom' ? '#ff0072' : '#1a192b')}
          nodeStrokeWidth={3}
          style={{ height: 100 }}
        />
      </ReactFlow>
    </div>
  );
}

export default App;
