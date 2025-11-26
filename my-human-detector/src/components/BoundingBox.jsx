import React from "react";

const BoundingBox = ({ box, label }) => {
  const style = {
    position: "absolute",
    border: "3px solid #ff006a",
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    pointerEvents: "none",
  };

  return (
    <div style={style}>
      <span
        style={{
          background: "#ff006a",
          color: "white",
          padding: "3px 6px",
          fontSize: "14px",
          position: "absolute",
          top: "-25px",
          left: "0",
          borderRadius: "5px",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default BoundingBox;
