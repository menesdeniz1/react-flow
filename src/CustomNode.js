import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Resizable } from 're-resizable';
import 'react-resizable/css/styles.css';

const CustomNode = ({ id, data, isConnectable }) => {
  const [size, setSize] = useState({
    width: data.width || 150,
    height: data.height || 100
  });

  const handleResize = useCallback((e, direction, ref, delta) => {
    const newWidth = size.width + delta.width;
    const newHeight = size.height + delta.height;

    const updatedSize = {
      width: Math.max(100, Math.min(400, newWidth)),
      height: Math.max(50, Math.min(300, newHeight))
    };

    setSize(updatedSize);

    if (data.onSizeChange) {
      data.onSizeChange(updatedSize);
    }
  }, [size, data]);

  const containerStyle = {
    border: `2px solid ${data.color || '#1a192b'}`,
    borderRadius: '5px',
    background: data.background || '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'default', // sol tık için önemli
    width: '100%',
    height: '100%'
  };

  return (
    <Resizable
      size={size}
      onResizeStop={handleResize}
      minWidth={100}
      minHeight={50}
      maxWidth={400}
      maxHeight={300}
      enable={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true
      }}
      style={{ position: 'relative' }} // Resizable dış stil
    >
      <div style={containerStyle}>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />

        <div style={{ userSelect: 'none' }}>{data.label}</div>

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
    </Resizable>
  );
};

export default CustomNode;
