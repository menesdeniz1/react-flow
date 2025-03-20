import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

const CustomNode = ({ data, id }) => {
  const [label, setLabel] = useState(data.label);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => setIsEditing(true);

  const handleChange = (e) => setLabel(e.target.value);

  const handleBlur = () => {
    setIsEditing(false);
    data.label = label; // Yeni etiketi node'a aktar
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={handleDoubleClick}
      style={{
        width: data.width || 150,
        height: data.height || 50,
        padding: 10,
        border: `2px solid ${data.color || '#1a192b'}`,
        borderRadius: 5,
        background: data.background || '#ffcc00',
        color: '#1a192b',
        fontSize: 14,
        boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {isEditing ? (
        <input
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            color: '#1a192b',
          }}
        />
      ) : (
        label
      )}

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </motion.div>
  );
};

export default CustomNode;
