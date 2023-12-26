// taken from https://eisenbergeffect.medium.com/an-esbuild-setup-for-typescript-3b24852479fe
export function createBuildSettings(options) {
  return {
    entryPoints: ["src/index.tsx"],
    // outfile: "dist/bundle.js",
    bundle: true,
    format: "esm",
    splitting: true,
    outdir: "dist",
    ...options,
  };
}
