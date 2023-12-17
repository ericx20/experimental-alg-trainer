"use client";
import React from "react";
import { SVG, Type, SVGVisualizerOptions, Visualizer } from "sr-puzzlegen";
import styles from "./PuzzleGen.module.css";

export interface PuzzleGenProps {
  type: Type;
  options: SVGVisualizerOptions;
}

export function PuzzleGen({ type, options }: PuzzleGenProps) {
  const container = React.useRef<HTMLDivElement>(null);
  const visualizer: React.MutableRefObject<Visualizer | null> =
    React.useRef(null);

  // Initial render
  React.useEffect(() => {
    if (!container.current) return;
    visualizer.current = SVG(container.current, type, options);
    // TODO: need to return cleanup function?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Updates
  React.useEffect(() => {
    if (!options.puzzle) return;
    visualizer.current?.setPuzzleOptions(options.puzzle);
  }, [options]);
  const { width, height } = options;
  return (
    <div
      className={styles.puzzleGenContainer}
      style={{ width, height }}
      ref={container}
    ></div>
  );
}

export const MASKS = {
  OCLS: {
    F: [0, 1, 2],
    B: [0, 1, 2],
    R: [0, 1, 2],
    L: [0, 1, 2],
  },
};
