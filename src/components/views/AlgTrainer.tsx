import React from "react";
import Button from "@mui/joy/Button";
import { Typography } from "@mui/joy";
import { useStore } from "../../store";
import { randomElement } from "../../utils";
import { PuzzleGen } from "../PuzzleGen";
import { MASKS } from "../../lib/puzzle-gen-config";
import { Alg } from "../../types";
import { Type } from "sr-puzzlegen";
import { generateOclsScramble } from "../../lib/scrambles";

export function AlgTrainer() {
  const { algSheet, getSelectedAlgs } = useStore();
  const algs = React.useMemo(getSelectedAlgs, [algSheet, getSelectedAlgs]);

  const [currentAlg, setCurrentAlg] = React.useState(randomElement(algs));

  const [isLoading, setLoading] = React.useState(false);
  const [currentScramble, setCurrentScramble] = React.useState("");

  // TODO: support recap mode
  const chooseAlg = React.useCallback(() => randomElement(algs), [algs]);

  const getNextAlg = React.useCallback(async () => {
    const nextAlg = chooseAlg();
    if (!nextAlg) return;
    setCurrentAlg(nextAlg);
    setLoading(true);
    const scramble = await generateOclsScramble(nextAlg.alg);
    setCurrentScramble(scramble);
    setLoading(false);
  }, [chooseAlg, setLoading]);

  React.useEffect(() => {
    getNextAlg();
  }, [algs, getNextAlg]);

  if (!currentAlg) {
    return <Typography>Need to select cases first!</Typography>;
  }

  return (
    <>
      <Typography>Scramble: {currentScramble}</Typography>
      <Button onClick={getNextAlg} loading={isLoading}>
        Next
      </Button>
      <AlgTrainerDisplay alg={currentAlg} />
      <Typography>Solution: {currentAlg.alg}</Typography>
    </>
  );
}

function AlgTrainerDisplay({ alg }: { alg: Alg }) {
  const options = {
    width: 100,
    height: 100,
    puzzle: {
      mask: MASKS.OCLS,
      case: alg.alg,
    },
  };
  return <PuzzleGen type={Type.CUBE} options={options} />;
}
