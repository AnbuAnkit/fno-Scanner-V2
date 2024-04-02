import React from "react";

const SvgComponent = ({ size }) => (
  <svg
    width={size}
    height={size / 1.4}
    viewBox={`0 0 ${size} ${size / 1.4}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={`M${size * 0.026} ${size * 0.974}L${size * 0.271} ${size * 0.053}H${
        size * 0.724
      }L${size * 0.971} ${size * 0.974}`}
      className="stroke-current text-primary"
      strokeWidth={size * 0.0832}
    />
  </svg>
);

export default SvgComponent;
