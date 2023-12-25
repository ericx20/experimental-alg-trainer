import { Alg as TwistyAlg } from "cubing/alg";
import { randomElement } from "../utils";
import { experimentalSolve3x3x3IgnoringCenters } from "cubing/search";
import { cube3x3x3 } from "cubing/puzzles";

const PLL = [
  {
    name: "H",
    alg: "M2' U M2' U2 M2' U M2'",
  },
  {
    name: "Ua",
    alg: "M2' U M U2 M' U M2'",
  },
  {
    name: "Ub",
    alg: "M2' U' M U2 M' U' M2'",
  },
  {
    name: "Z",
    alg: "M2' U2 M U M2' U M2' U M",
  },
  {
    name: "Aa",
    alg: "x R' U R' D2 R U' R' D2 R2 x'",
  },
  {
    name: "Ab",
    alg: "x R2 D2 R U R' D2 R U' R x'",
  },
  {
    name: "F",
    alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
  },
  {
    name: "Ga",
    alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'",
  },
  {
    name: "Gb",
    alg: "R' U' R U D' R2 U R' U R U' R U' R2' D",
  },
  {
    name: "Gc",
    alg: "R2' U' R U' R U R' U R2 U D' R U' R' D",
  },
  {
    name: "Gd",
    alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
  },
  {
    name: "Ja",
    alg: "x R2' F R F' R U2' r' U r U2' x'",
  },
  {
    name: "Jb",
    alg: "R U R' F' R U R' U' R' F R2 U' R'",
  },
  {
    name: "Ra",
    alg: "R U' R' U' R U R D R' U' R D' R' U2 R'",
  },
  {
    name: "Rb",
    alg: "R' U2' R U2 R' F R U R' U' R' F' R2",
  },
  {
    name: "T",
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
  },
  {
    name: "E",
    alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
  },
  {
    name: "Na",
    alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
  },
  {
    name: "Nb",
    alg: "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
  },
  {
    name: "V",
    alg: "R U' R U R' D R D' R U' D R2' U R2 D' R2'",
  },
  {
    name: "Y",
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  },
];

// TODO: make this weighted, so they're applied with the right probability
export function randomPllSetup(): string {
  return randomElement(PLL)!.alg;
}

export const AUF = ["", "U", "U'", "U2"];

// oclsAlg needs to be in valid Singmaster notation
export async function generateOclsScramble(
  oclsAlg: string,
  preAuf: string
): Promise<string> {
  const pllSetup = [
    randomElement(AUF),
    randomPllSetup(),
    randomElement(AUF),
  ].join(" ");
  const oclsSetup = new TwistyAlg(pllSetup)
    .concat(new TwistyAlg(oclsAlg).invert())
    .concat(preAuf);

  const kpuzzle = await cube3x3x3.kpuzzle();
  const randomState = kpuzzle.defaultPattern().applyAlg(oclsSetup);

  const solution = await experimentalSolve3x3x3IgnoringCenters(randomState);
  return solution
    .invert()
    .experimentalSimplify({ puzzleLoader: cube3x3x3 })
    .toString();
}
