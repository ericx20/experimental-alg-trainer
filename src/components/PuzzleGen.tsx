import React from "react";
import { SVG, Type } from "sr-puzzlegen";
import type { SVGVisualizerOptions } from "sr-puzzlegen";
import "./PuzzleGen.css";

export interface PuzzleGenProps {
  type: Type;
  options: SVGVisualizerOptions;
  className?: string;
}

export function PuzzleGen({ type, options, className }: PuzzleGenProps) {
  const container = React.useRef<HTMLDivElement>(null);

  // Initial render
  React.useEffect(() => {
    if (!container.current) return;
    SVG(container.current, type, options);
    // TODO: need to return cleanup function?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Updates
  React.useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";
    SVG(container.current, type, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, options.puzzle?.alg, options.puzzle?.case]);
  const { width, height } = options;
  return (
    <div
      className={["puzzlegen-container", className].join(" ")}
      style={{ width, height }}
      ref={container}
    ></div>
  );
}
