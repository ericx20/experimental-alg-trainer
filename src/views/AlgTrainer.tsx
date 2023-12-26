import React from "react";
import {
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { useStore } from "../store";
import { randomElement, shuffle } from "../utils";
import { PuzzleGen } from "../components/PuzzleGen";
import { MASKS, SCHEME } from "../lib/puzzle-gen-config";
import { Type } from "sr-puzzlegen";
import { AUF, generateOclsScramble } from "../lib/scrambles";
import { Alg as TwistyAlg } from "cubing/alg";
import { cube3x3x3 } from "cubing/puzzles";
import type { Alg } from "../types";
import { useSpacebar } from "../hooks";

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
      <Stack direction="row" spacing={1} justifyContent="space-evenly">
        <Button disabled={disabled} onClick={() => setRandomTrainerOpen(true)}>
          Train
        </Button>
        <Button
          disabled={disabled}
          onClick={() => setRecapTrainerOpen(true)}
          variant="outlined"
        >
          Recap
        </Button>
      </Stack>
      <Modal
        open={randomTrainerOpen}
        onClose={() => setRandomTrainerOpen(false)}
      >
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <AlgTrainerRandom onFinished={() => setRandomTrainerOpen(false)} />
        </ModalDialog>
      </Modal>
      <Modal open={recapTrainerOpen} onClose={() => setRecapTrainerOpen(false)}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <AlgTrainerRecap onFinished={() => setRecapTrainerOpen(false)} />
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

interface AlgTrainerRandomProps {
  onFinished: () => void;
}

function AlgTrainerRandom({ onFinished }: AlgTrainerRandomProps) {
  const { getSelectedAlgs } = useStore();
  const algs = React.useMemo(getSelectedAlgs, [getSelectedAlgs]);

  const [hidden, setHidden] = React.useState(true);

  const alreadySeen = React.useRef<Record<string, boolean>>({});

  const chooseAlg = React.useCallback(() => {
    const newAlg = randomElement(algs);
    if (newAlg) {
      alreadySeen.current[newAlg?.id] = true;
    }
    return newAlg;
  }, [algs]);

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

  const [isReview, setReview] = React.useState(false);

  useSpacebar(getNextAlg, isReview);

  if (isReview) {
    return (
      <>
        <DialogTitle>Update alg progress</DialogTitle>
        <Divider />
        <DialogContent>
          <AlgStatusReview
            algs={algs.filter((alg) => alreadySeen.current[alg.id])}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="plain" onClick={onFinished}>
            Done
          </Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        height="100%"
        spacing={2}
      >
        <AlgTrainerDisplay
          scramble={scramble}
          solution={solution}
          hidden={hidden}
          loading={loading}
          setHidden={setHidden}
          next={getNextAlg}
        />
      </Stack>
      <DialogActions>
        <Button variant="plain" onClick={() => setReview(true)}>
          End session
        </Button>
      </DialogActions>
    </>
  );
}

interface AlgTrainerRecapProps {
  onFinished: () => void;
}
function AlgTrainerRecap({ onFinished }: AlgTrainerRecapProps) {
  const { getSelectedAlgs } = useStore();
  const selectedAlgs = React.useMemo(getSelectedAlgs, [getSelectedAlgs]);
  const shuffledAlgs = React.useMemo(
    () => shuffle(selectedAlgs),
    [selectedAlgs]
  );

  const [currIndex, setCurrIndex] = React.useState(0);

  const [hidden, setHidden] = React.useState(true);

  const chooseAlg = React.useCallback(() => {
    return shuffledAlgs[currIndex] ?? shuffledAlgs.at(-1);
  }, [currIndex, shuffledAlgs]);

  const onNextScramble = React.useCallback(() => {
    setHidden(true);
  }, [setHidden]);

  const { loading, scramble, solution, getNextAlg } = useOclsScramble(
    chooseAlg,
    onNextScramble
  );

  const onNext = () => {
    if (!shuffledAlgs.length || currIndex >= shuffledAlgs.length) return;
    setCurrIndex(currIndex + 1);
    getNextAlg();
  };

  React.useEffect(() => {
    getNextAlg();
  }, [getNextAlg]);

  const finished = currIndex >= shuffledAlgs.length;

  useSpacebar(onNext, finished);

  if (!shuffledAlgs.length)
    return <Typography>Need to select algs first</Typography>;

  if (finished) {
    return (
      <>
        <DialogTitle>Update alg progress</DialogTitle>
        <Divider />
        <DialogContent>
          <AlgStatusReview algs={selectedAlgs} />
        </DialogContent>
        <DialogActions>
          <Button variant="plain" onClick={onFinished}>
            Done
          </Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <LinearProgress
        determinate
        value={(currIndex * 100) / shuffledAlgs.length}
        sx={{ marginRight: "28px" }}
      />
      <Stack
        alignItems="center"
        justifyContent="center"
        height="100%"
        spacing={2}
      >
        <AlgTrainerDisplay
          scramble={scramble}
          solution={solution}
          hidden={hidden}
          loading={loading}
          setHidden={setHidden}
          next={onNext}
        />
      </Stack>
    </>
  );
}

interface AlgTrainerDisplayProps {
  scramble: string;
  solution: string;
  hidden: boolean;
  loading: boolean;
  setHidden: (nowHidden: boolean) => void;
  next: () => void;
}
function AlgTrainerDisplay({
  scramble,
  solution,
  hidden,
  loading,
  setHidden,
  next,
}: AlgTrainerDisplayProps) {
  const options = {
    width: 150,
    height: 150,
    puzzle: {
      mask: MASKS.OCLS,
      case: solution,
      scheme: SCHEME,
    },
  };
  return (
    <>
      <Typography textAlign="center" fontSize="lg">
        Scramble: <br />
        {scramble !== "" ? scramble : "Loading..."}
      </Typography>
      <PuzzleGen type={Type.CUBE} options={options} />
      <Box
        height="50px"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {hidden && (
          <Button onClick={() => setHidden(false)} variant="outlined">
            Show solution
          </Button>
        )}
        {!hidden && <Typography fontSize="lg">Solution: {solution}</Typography>}
      </Box>
      <Button onClick={next} loading={loading} sx={{ width: "150px" }}>
        Next
      </Button>
    </>
  );
}

interface AlgStatusReviewProps {
  algs: Alg[];
}
function AlgStatusReview({ algs }: AlgStatusReviewProps) {
  const { setAlgStatusById } = useStore();
  return (
    <Grid container spacing="10px">
      {algs.map((alg) => (
        <Grid width="160px" key={alg.id}>
          <Card sx={{ padding: "4px" }}>
            <Stack justifyContent="center">
              <Box sx={{ marginRight: "auto", marginLeft: "auto" }}>
                <PuzzleGen
                  type={Type.CUBE_TOP}
                  options={{
                    puzzle: {
                      case: alg.alg,
                      mask: MASKS.OCLS,
                      scheme: SCHEME,
                    },
                    width: 100,
                    height: 100,
                  }}
                />
              </Box>
              <Select
                // optimistic and sketchy
                defaultValue={alg.status}
                onChange={(_, newValue) =>
                  newValue && setAlgStatusById(alg.id, newValue)
                }
                sx={{ width: "100%" }}
              >
                <Option value="unlearned">Not learned</Option>
                <Option value="learning">Learning</Option>
                <Option value="learned">Learned</Option>
              </Select>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
