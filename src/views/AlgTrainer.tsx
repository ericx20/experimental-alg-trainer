import React from "react";
import Button from "@mui/joy/Button";
import { Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { useStore } from "../store";
import { randomElement } from "../utils";
import { PuzzleGen } from "../components/PuzzleGen";
import { MASKS } from "../lib/puzzle-gen-config";
import { Type } from "sr-puzzlegen";
import { AUF, generateOclsScramble } from "../lib/scrambles";
import { Alg as TwistyAlg } from "cubing/alg";
import { cube3x3x3 } from "cubing/puzzles";
import type { Alg } from "../types";

export function AlgTrainer() {
  const { getSelectedAlgs, algSheet } = useStore();
  const disabled = React.useMemo(
    () => getSelectedAlgs().length === 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSelectedAlgs, algSheet]
  );
  const [randomTrainerOpen, setRandomTrainerOpen] = React.useState(false);
  const [recapTrainerOpen, setRecapTrainerOpen] = React.useState(false);

  return (
    <>
      <Button disabled={disabled} onClick={() => setRandomTrainerOpen(true)}>
        Trainer
      </Button>
      <Button disabled={disabled} onClick={() => setRecapTrainerOpen(true)}>
        Recap
      </Button>
      <Modal
        open={randomTrainerOpen}
        onClose={() => setRandomTrainerOpen(false)}
      >
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <AlgTrainerRandom />
        </ModalDialog>
      </Modal>
      <Modal open={recapTrainerOpen} onClose={() => setRecapTrainerOpen(false)}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <AlgTrainerRecap />
        </ModalDialog>
      </Modal>
    </>
  );
}

function useOclsScramble(
  chooseNextAlg: () => Alg | undefined,
  onNextScramble?: () => void
) {
  const [loading, setLoading] = React.useState(false);
  const [currentScramble, setCurrentScramble] = React.useState("");
  const [currentSolution, setCurrentSolution] = React.useState("");

  const getNextAlg = React.useCallback(async () => {
    const nextAlg = chooseNextAlg();
    if (!nextAlg) return;
    const impatient = setTimeout(() => setLoading(true), 500);
    const preAuf = randomElement(AUF)!;
    const scramble = await generateOclsScramble(nextAlg.alg, preAuf);
    const solution = new TwistyAlg(preAuf)
      .invert()
      .concat(
        new TwistyAlg(nextAlg.alg.replaceAll("(", "").replaceAll(")", ""))
      )
      .experimentalSimplify({
        cancel: true,
        puzzleLoader: cube3x3x3,
      })
      .toString();
    setCurrentScramble(scramble);
    setCurrentSolution(solution);
    clearTimeout(impatient);
    setLoading(false);
    onNextScramble && onNextScramble();
  }, [chooseNextAlg, onNextScramble, setLoading]);

  return {
    loading,
    scramble: currentScramble,
    solution: currentSolution,
    getNextAlg,
  };
}

function AlgTrainerRandom() {
  const { algSheet, getSelectedAlgs } = useStore();
  const algs = React.useMemo(getSelectedAlgs, [algSheet, getSelectedAlgs]);

  const [hidden, setHidden] = React.useState(true);

  // TODO: support recap mode
  const chooseAlg = React.useCallback(() => randomElement(algs), [algs]);

  const onNextScramble = React.useCallback(() => {
    setHidden(true);
  }, [setHidden]);

  const { loading, scramble, solution, getNextAlg } = useOclsScramble(
    chooseAlg,
    onNextScramble
  );

  React.useEffect(() => {
    getNextAlg();
  }, [getNextAlg]);

  return (
    <>
      <Typography>Scramble: {scramble}</Typography>

      <AlgTrainerDisplay alg={solution} />
      <Button onClick={() => setHidden(!hidden)}>
        {hidden ? "show" : "hide"} solution
      </Button>
      {!hidden && <Typography>Solution: {solution}</Typography>}
      <Button onClick={getNextAlg} loading={loading}>
        Next
      </Button>
    </>
  );
}

function AlgTrainerRecap() {
  return <Typography>WIP</Typography>;
}

function AlgTrainerDisplay({ alg }: { alg: string }) {
  const options = {
    width: 100,
    height: 100,
    puzzle: {
      mask: MASKS.OCLS,
      case: alg,
    },
  };
  return <PuzzleGen type={Type.CUBE} options={options} />;
}
