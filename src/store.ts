import { create } from "zustand";
import { AlgSheet, AlgStatus, Alg, DefaultAlgSheet } from "./types";
import { OCLS } from "./defaultAlgs/ocls";
// import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  algSheet: AlgSheet;
};

type Actions = {
  getSelectedAlgs: () => Alg[];
  setAlgSelected: (algSetId: string, algId: string, selected: boolean) => void;
  setAlgStatus: (algSetId: string, algId: string, status: AlgStatus) => void;
};

function id() {
  return crypto.randomUUID();
}

function processDefaultAlgSheet(algSheet: DefaultAlgSheet): AlgSheet {
  const { name, algSets } = algSheet;
  return {
    name,
    algSets: algSets.map(({ name, algs }) => ({
      name,
      algs: algs.map(({ name, alg }) => ({
        name,
        alg,
        id: id(),
        status: "unlearned",
        selected: false,
      })),
      id: id(),
      selected: false,
    })),
    id: id(),
  };
}

export const useStore = create<State & Actions>()(
  // TODO: once stable, add back persist
  // persist(
  immer((set, get) => ({
    algSheet: processDefaultAlgSheet(OCLS),
    getSelectedAlgs: () => {
      console.log("selecting the algs");
      const algSets = get().algSheet.algSets;
      return algSets.flatMap((algSet) =>
        algSet.algs.filter((alg) => alg.selected)
      );
    },
    setAlgSelected: (algSetId, algId, selected) =>
      set((state) => {
        const algSet = state.algSheet.algSets.find(
          (algSet) => algSet.id === algSetId
        );
        if (!algSet) return;
        const alg = algSet.algs.find((alg) => alg.id === algId);
        if (alg) alg.selected = selected;
      }),
    setAlgStatus: (algSetId, algId, newStatus) =>
      set((state) => {
        const algSetIndex = state.algSheet.algSets.findIndex(
          (algSet) => algSet.id === algSetId
        );
        if (algSetIndex < 0) return;
        const algIndex = state.algSheet.algSets[algSetIndex].algs.findIndex(
          (alg) => alg.id === algId
        );
        if (algIndex < 0) return;
        state.algSheet.algSets[algSetIndex].algs[algIndex].status = newStatus;
      }),
  }))
  //   {
  //     name: "algStore",
  //     version: 1,
  //   }
  // )
);

export function reset() {
  localStorage.removeItem("algStore");
  window.location.reload();
}
