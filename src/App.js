import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const initialNodes = [
  {
    id: 'subflow-node',
    type: 'default',
    position: { x: 400, y: 150 },
    data: { label: 'Main Container' },
    style: {
      background: '#ffcc00',
      padding: '10px',
      borderRadius: '5px',
      width: 300,
      height: 200,
    },
    className: 'parent-node',
  }
];

const nodeTypes = {
  custom: CustomNode,
};

let id = 1;
const getId = () => `node-${id++}`;

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const { project } = useReactFlow();

  const onSizeChange = useCallback((id, newSize) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                width: newSize.width,
                height: newSize.height,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const mainContainer = nodes.find(n => n.id === 'subflow-node');
      const isInsideContainer = 
        position.x > mainContainer.position.x &&
        position.x < mainContainer.position.x + mainContainer.style.width &&
        position.y > mainContainer.position.y &&
        position.y < mainContainer.position.y + mainContainer.style.height;

      const newNode = {
        id: getId(),
        type,
        position: isInsideContainer ? {
          x: position.x - mainContainer.position.x,
          y: position.y - mainContainer.position.y,
        } : position,
        data: { 
          label: `${type} Node`,
          width: 150,
          height: 100,
          color: type === 'custom' ? '#ff0072' : '#1a192b',
          background: '#ffffff',
          onSizeChange: (size) => onSizeChange(getId() - 1, size),
        },
      };

      if (isInsideContainer) {
        newNode.parentNode = 'subflow-node';
        newNode.extent = 'parent';
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [project, nodes, setNodes, onSizeChange]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const styles = {
    toolbar: {
      width: '200px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRight: '1px solid #dee2e6',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    draggableNode: {
      padding: '10px',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'grab',
      marginBottom: '8px',
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={styles.toolbar}>
        <h3>Node Types</h3>
        <div
          style={styles.draggableNode}
          onDragStart={(event) => onDragStart(event, 'custom')}
          draggable
        >
          Custom Node
        </div>
        <div
          style={styles.draggableNode}
          onDragStart={(event) => onDragStart(event, 'default')}
          draggable
        >
          Default Node
        </div>
      </div>

      <div ref={reactFlowWrapper} style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="react-flow"
        >
          <Controls />
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
