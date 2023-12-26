import esbuild from "esbuild";
import { createBuildSettings } from "./settings.mjs";

// taken from https://eisenbergeffect.medium.com/an-esbuild-setup-for-typescript-3b24852479fe
const settings = createBuildSettings({
  sourcemap: true,
  // banner: {
  //   js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
  // },
});

const ctx = await esbuild.context(settings);

await ctx.watch();

const { host, port } = await ctx.serve({
  port: 5500,
  servedir: "dist",
  fallback: "dist/index.html",
});

console.log(`Serving app at ${host}:${port}.`);
