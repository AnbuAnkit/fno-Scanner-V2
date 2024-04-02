import React from "react";

const CustomSVG = ({ size }) => {
  // Calculate coordinates based on size
  const startX = size * 0.0212;
  const startY = size * 0.7729;
  const midX = size * 0.5005;
  const midY = size * 0.2346;
  const endX = size * 0.9798;
  const endY = size * 0.7729;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M${startX} ${startY} L${midX} ${midY} L${endX} ${endY}`}
        className="stroke-current text-primary"
        strokeWidth={size * 0.1}
      />
    </svg>
  );
};

export default CustomSVG;
