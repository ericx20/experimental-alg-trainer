import { create } from "zustand";
import type { AlgSheet, AlgStatus, Alg, DefaultAlgSheet } from "./types";
import { OCLS } from "./defaultAlgs/ocls";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  algSheet: AlgSheet;
};

type Actions = {
  getSelectedAlgs: () => Alg[];
  getAlgById: (algId: string) => Alg | undefined;
  setAlgSelected: (algSetId: string, algId: string, selected: boolean) => void;
  setAlgStatusById: (algId: string, status: AlgStatus) => void;
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
  persist(
    immer((set, get) => ({
      algSheet: processDefaultAlgSheet(OCLS),
      getSelectedAlgs: () => {
        const algSets = get().algSheet.algSets;
        return algSets.flatMap((algSet) =>
          algSet.algs.filter((alg) => alg.selected)
        );
      },
      getAlgById: (algId) => {
        for (const algSet of get().algSheet.algSets) {
          const algIndex = algSet.algs.findIndex((alg) => alg.id === algId);
          if (algIndex < 0) continue;
          // we've found the alg!
          return algSet.algs[algIndex];
        }
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
      setAlgStatusById: (algId, newStatus) =>
        set((state) => {
          state.algSheet.algSets.some((algSet) => {
            const algIndex = algSet.algs.findIndex((alg) => alg.id === algId);
            if (algIndex < 0) return false;
            // we've found the alg!
            algSet.algs[algIndex].status = newStatus;
            return true;
          });
        }),
    })),
    {
      name: "algStore",
      version: 2,
    }
  )
);

export function reset() {
  localStorage.removeItem("algStore");
  window.location.reload();
}
