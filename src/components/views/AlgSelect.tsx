import React from "react";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Checkbox from "@mui/joy/Checkbox";
import Card from "@mui/joy/Card";
import { useStore } from "../../store";
import { Button } from "@mui/joy";
import { Alg, AlgSet } from "../../types";
import { Type } from "sr-puzzlegen";
import { MASKS } from "../../lib/puzzle-gen-config";
import { PuzzleGen } from "../PuzzleGen";

// folder structure is a mess, TODO move this file elsewhere
export function AlgSelect() {
  const { algSheet } = useStore();
  return (
    <>
      <Typography level="h2">Select algs to train</Typography>
      <Grid container spacing="10px">
        {algSheet.algSets.map(SelectAlgSet)}
      </Grid>
    </>
  );
}

// TODO: lazy load with https://react.dev/reference/react/lazy
function SelectAlgSet(algSet: AlgSet) {
  const [open, setOpen] = React.useState(false);
  const headerId = `alg-list-set-header-${algSet.id}`;
  const selectedAlgCount = algSet.algs.filter((alg) => alg.selected).length;
  return (
    <Grid xs={6} sm={4} key={algSet.id}>
      <Card>
        <Typography>
          {algSet.name} ({selectedAlgCount}/{algSet.algs.length})
        </Typography>
        <Button onClick={() => setOpen(true)}>Select...</Button>
        <Modal keepMounted open={open} onClose={() => setOpen(false)}>
          <ModalDialog layout="fullscreen" aria-labelledby={headerId}>
            <ModalClose />
            <Typography id={headerId} level="h3">
              Select cases in {algSet.name}
            </Typography>
            <Grid container spacing="10px" sx={{ overflow: "scroll" }}>
              {algSet.algs.map((alg) => SelectAlg(algSet.id, alg))}
            </Grid>
          </ModalDialog>
        </Modal>
      </Card>
    </Grid>
  );
}

function SelectAlg(algSetId: string, alg: Alg) {
  const { setAlgSelected } = useStore();
  return (
    <Grid xs={4} sm={3} lg={2} xl={1} key={alg.id}>
      <Card
        onClick={() => setAlgSelected(algSetId, alg.id, !alg.selected)}
        sx={{ cursor: "pointer" }}
      >
        <Checkbox
          checked={alg.selected}
          onChange={(e) => setAlgSelected(algSetId, alg.id, e.target.checked)}
          label={alg.name}
        />
        <PuzzleGen
          type={Type.CUBE}
          options={{
            puzzle: {
              case: alg.alg,
              mask: MASKS.OCLS,
            },
          }}
        />
      </Card>
    </Grid>
  );
}
