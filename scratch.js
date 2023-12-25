import { readFile, writeFile } from "node:fs";

readFile("./in.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const groupedLines = data.split(/\r?\n\r?\n/);
  const algs = groupedLines.map((group) => {
    const algs = group
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const name = "";
        let alg = line.trim();
        alg = alg.replaceAll("[", "(").replaceAll("]", ")").trim();
        return { name, alg };
      });
    return {
      name: "",
      algs,
    };
  });

  writeFile("out.json", JSON.stringify(algs), (err) => {
    if (err) {
      console.log(err);
    }
  });
});
