import React, { useRef, useEffect, useState } from "react";

export default function HeatMapLegend({ colors }) {
  const gradient = colors.map((color) => color.value).join(", ");

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          height: "20px",
          background: `linear-gradient(to right, ${gradient})`,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          top: "25px",
          width: "100%",
        }}
      >
        {colors.map((color, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <div
              style={{
                height: "10px",
                width: "10px",
                backgroundColor: color.value,
                borderRadius: "50%",
              }}
            />
            <span
              style={{ fontSize: "12px", marginTop: "2px", display: "block" }}
            >
              {color.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
