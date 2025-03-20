import React from 'react';
import { getBezierPath, BaseEdge } from 'reactflow';

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style, data }) => {
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

  return (
    <>
      <BaseEdge 
        id={id} 
        path={path} 
        style={{ stroke: '#4CAF50', strokeWidth: 3, strokeDasharray: '5 5' }} // Stil güncellemesi
      />
      <text
        x={labelX}
        y={labelY}
        fill="#4CAF50"
        fontSize={12}
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
      >
        {data?.label}
      </text>
      <path
        d={`M${targetX - 5},${targetY - 5} L${targetX},${targetY} L${targetX - 5},${targetY + 5}`}
        fill="#4CAF50"
        stroke="#4CAF50"
        strokeWidth={2}
        transform={`rotate(${angle}, ${targetX}, ${targetY})`}
      />
    </>
  );
};

export default CustomEdge;
