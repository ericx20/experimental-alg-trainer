"use client";
import React from "react";
import { SVG, Type, SVGVisualizerOptions } from "sr-puzzlegen";
import styles from "./PuzzleGen.module.css";

export interface PuzzleGenProps {
  type: Type;
  options: SVGVisualizerOptions;
}

export function PuzzleGen({ type, options }: PuzzleGenProps) {
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
      className={styles.puzzleGenContainer}
      style={{ width, height }}
      ref={container}
    ></div>
  );
}
