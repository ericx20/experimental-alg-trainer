import React from "react";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
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
import { useMediaQuery } from "../hooks";
import styles from "./AlgSelect.module.css";

export function AlgSelect() {
  const { algSheet } = useStore();
  return (
    <Grid container spacing="10px">
      {algSheet.algSets.map(SelectAlgSet)}
    </Grid>
  );
}

// TODO: lazy load with https://react.dev/reference/react/lazy
function SelectAlgSet(algSet: AlgSet) {
  const [open, setOpen] = React.useState(false);
  const headerId = `alg-list-set-header-${algSet.id}`;
  const selectedAlgCount = algSet.algs.filter((alg) => alg.selected).length;
  const exampleAlg = algSet.algs.at(0)?.alg;
  const isMobile = useMediaQuery("(max-width: 599.95px)");
  return (
    <Grid /* xs={6} sm={4} */ key={algSet.id}>
      <Card
        component="button"
        onClick={() => setOpen(true)}
        sx={{
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
            className={styles.puzzlegen}
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
          <ModalDialog
            layout={isMobile ? "fullscreen" : "center"}
            aria-labelledby={headerId}
          >
            <ModalClose />
            <Typography id={headerId} level="h3">
              Select cases{algSet.name ? `in ${algSet.name}` : ""}
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
          className={styles.puzzlegen}
        />
      </Card>
    </Grid>
  );
}
