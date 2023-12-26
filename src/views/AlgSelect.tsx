import React from "react";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Checkbox from "@mui/joy/Checkbox";
import Card from "@mui/joy/Card";
import { useStore } from "../store";
import type { Alg, AlgSet } from "../types";
import { Type } from "sr-puzzlegen";
import { MASKS, SCHEME } from "../lib/puzzle-gen-config";
import { PuzzleGen } from "../components/PuzzleGen";
import "./AlgSelect.css";
import { Button, DialogActions, DialogTitle, Divider } from "@mui/joy";
import { useMediaQuery } from "../hooks";

export function AlgSelect() {
  const { algSheet } = useStore();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography level="h3" justifyContent="center" marginBottom={1}>
        Select algs to train
      </Typography>
      <Grid container spacing="10px">
        {algSheet.algSets.map(SelectAlgSet)}
      </Grid>
    </Box>
  );
}

// TODO: lazy load with https://react.dev/reference/react/lazy
function SelectAlgSet(algSet: AlgSet) {
  const { setAlgSelected } = useStore();
  const [open, setOpen] = React.useState(false);
  const selectedAlgCount = algSet.algs.filter((alg) => alg.selected).length;
  const exampleAlg = algSet.algs.at(0)?.alg;
  const isSmallishScreen = useMediaQuery("(max-width: 1000px)");
  const isFullScreen = algSet.algs.length >= 12 || isSmallishScreen;

  const setSelectAll = (selected: boolean) => {
    algSet.algs.forEach((alg) => setAlgSelected(algSet.id, alg.id, selected));
  };

  return (
    <Grid xs={4} sm={3} md={2} key={algSet.id}>
      <Card
        component="button"
        onClick={() => setOpen(true)}
        sx={{
          width: "100%",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "md",
            borderColor: "neutral.outlinedHoverBorder",
          },
        }}
      >
        {exampleAlg && (
          <PuzzleGen
            type={Type.CUBE}
            options={{
              puzzle: {
                case: exampleAlg,
                mask: MASKS.F2L,
                scheme: SCHEME,
              },
            }}
            className="algselect-puzzlegen"
          />
        )}
        <Typography>
          {algSet.name ? `${algSet.name} ` : ""}({selectedAlgCount}/
          {algSet.algs.length})
        </Typography>
        <Modal
          keepMounted
          open={open}
          onClose={() => setOpen(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalDialog layout={isFullScreen ? "fullscreen" : "center"}>
            <ModalClose />
            <DialogTitle>
              Select cases{algSet.name ? `in ${algSet.name}` : ""}
            </DialogTitle>
            <Divider />
            <Grid container spacing="10px" sx={{ overflow: "scroll" }}>
              {algSet.algs.map((alg) => SelectAlg(algSet.id, alg))}
            </Grid>
            <DialogActions>
              <Button
                disabled={selectedAlgCount === 0}
                onClick={() => setSelectAll(false)}
                variant="outlined"
                color="danger"
              >
                Clear all
              </Button>
              <Button
                disabled={selectedAlgCount === algSet.algs.length}
                onClick={() => setSelectAll(true)}
                variant="outlined"
              >
                Select all
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
      </Card>
    </Grid>
  );
}

function SelectAlg(algSetId: string, alg: Alg) {
  const { setAlgSelected } = useStore();
  return (
    <Grid key={alg.id}>
      <Card
        onClick={() => setAlgSelected(algSetId, alg.id, !alg.selected)}
        sx={{ cursor: "pointer" }}
      >
        <Checkbox
          checked={alg.selected}
          onChange={(e) => setAlgSelected(algSetId, alg.id, e.target.checked)}
          label={alg.name}
          overlay
        />
        <PuzzleGen
          type={Type.CUBE_TOP}
          options={{
            puzzle: {
              case: alg.alg,
              mask: MASKS.OCLS,
              scheme: SCHEME,
            },
          }}
          className="algselect-puzzlegen"
        />
      </Card>
    </Grid>
  );
}
