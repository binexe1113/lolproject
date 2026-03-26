"use client";

import { useEffect, useState } from "react";

export function InteractiveBackground() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      className="interactive-grid"
      style={{
        "--x": `${position.x}px`,
        "--y": `${position.y}px`
      } as React.CSSProperties}
    />
  );
}
