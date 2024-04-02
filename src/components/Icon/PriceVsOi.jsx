import React from "react";

const SvgComponent = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={`M${size * 0.0288} 0V${size * 0.9638}H${size}`}
      className="stroke-current text-primary"
      strokeWidth={size / 12}
    />
    <path
      d={`M${size * 0.1178} ${size * 0.4831}L${size * 0.3942} ${
        size * 0.2427
      }L${size * 0.6154} ${size * 0.2985}L${size * 0.9423} ${size * 0.0923}`}
      className="stroke-current text-primary"
      strokeWidth={size / 12}
    />
    <path
      d={`M${size * 0.1202} ${size * 0.8738}L${size * 0.3942} ${
        size * 0.6184
      }L${size * 0.673} ${size * 0.7485}L${size * 0.9423} ${size * 0.3617}`}
      className="stroke-current text-primary"
      strokeWidth={size / 12}
    />
  </svg>
);

export default SvgComponent;
