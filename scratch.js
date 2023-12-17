import { readFile, writeFile } from "node:fs";

readFile("./in.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split(/\r?\n/).filter(Boolean);
  const algs = lines.map((line) => {
    let [name, alg] = line.split("\t\t");
    name = "CO " + name;
    alg = alg.replaceAll("[", "(").replaceAll("]", ")");
    return { name, alg };
  });

  writeFile("out.json", JSON.stringify(algs), (err) => {
    if (err) {
      console.log(err);
    }
  });
});
