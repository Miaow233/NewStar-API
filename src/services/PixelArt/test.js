const Pixelit = require("./pixelit.js").Pixelit
const argv = require("yargs/yargs")(process.argv.slice(2))
  .command("$0 <input> <output>")
  .option("palette", {
    alias: "p",
    type: "number",
    description: "number of colors",
  })
  .option("scale", {
    alias: "s",
    type: "number",
  })
  .option("algorithm", {
    alias: "a",
    type: "string",
  }).argv;
const { loadImage, createCanvas } = require("canvas");
const fs = require("fs");

async function main() {
  const img = await loadImage(argv.input);
  const canvas = createCanvas(img.width, img.height);
  const px = new Pixelit({
    from: img,
    to: canvas,
    palette: argv.palette,
    scale: argv.scale,
    similarColorAlgorithm: argv.algorithm,
  });
  px.pixelate();
  px.convertPalette();
  px.resizeImage();
  const buffer = px.drawto.toBuffer("image/png");
  fs.writeFileSync(argv.output, buffer);
}

main();
