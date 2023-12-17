export interface DefaultAlgSheet {
  name: string;
  algSets: DefaultAlgSet[];
}

type DefaultAlgSet = {
  name: string;
  algs: DefaultAlg[];
};

type DefaultAlg = {
  name: string;
  alg: string;
};

export interface AlgSheet {
  name: string;
  algSets: AlgSet[];
  id: string;
}

export type AlgSet = {
  name: string;
  id: string;
  algs: Alg[];
};

export type Alg = {
  name: string;
  id: string;
  selected: boolean;
  alg: string;
  status: AlgStatus;
};

export type AlgStatus = "unlearned" | "learning" | "learned";
