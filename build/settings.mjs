// taken from https://eisenbergeffect.medium.com/an-esbuild-setup-for-typescript-3b24852479fe
export function createBuildSettings(options) {
  return {
    entryPoints: ["src/index.tsx", "src/index.html"],
    // outfile: "dist/bundle.js",
    bundle: true,
    format: "esm",
    splitting: true,
    outdir: "dist",
    // https://github.com/evanw/esbuild/issues/621
    loader: {
      ".html": "copy",
    },
    ...options,
  };
}
