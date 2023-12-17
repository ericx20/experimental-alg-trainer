import React from "react";
import Button from "@mui/joy/Button";
import { Typography } from "@mui/joy";
import { useStore } from "../../store";
import { randomElement } from "../../utils";
import { MASKS, PuzzleGen } from "../PuzzleGen";
import { Alg } from "../../types";
import { Type } from "sr-puzzlegen";

export function AlgTrainer() {
  const { algSheet, getSelectedAlgs } = useStore();
  const algs = React.useMemo(getSelectedAlgs, [algSheet, getSelectedAlgs]);

  const [currentAlg, setCurrentAlg] = React.useState(randomElement(algs));
  const chooseAlg = () => {
    // TODO: support recap mode
    setCurrentAlg(randomElement(algs));
  };
  React.useEffect(chooseAlg, [algs]);

  const getNextAlg = () => {
    setCurrentAlg(randomElement(algs));
  };

  if (!currentAlg) {
    return <Typography>Need to select cases first!</Typography>;
  }

  return (
    <>
      <Typography>{currentAlg.name}</Typography>
      <Button onClick={getNextAlg}>Next</Button>
      <AlgTrainerDisplay alg={currentAlg} />
    </>
  );
}

function AlgTrainerDisplay({ alg }: { alg: Alg }) {
  return (
    <PuzzleGen
      type={Type.CUBE}
      options={{
        width: 100,
        height: 100,
        puzzle: { case: alg.alg, mask: MASKS.OCLS },
      }}
    />
  );
}
