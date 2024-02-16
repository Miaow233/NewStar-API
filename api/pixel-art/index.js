const { loadImage, createCanvas } = require("canvas");
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const multiparty = require("multiparty");
const pixelit = require("./pixelit.js");
const router = express.Router();
const upload = multer({ dest: "./uploads" });

router.post("/", upload.single('file'), async (req, res, next) => {
  console.log(req.file);
  // load image from req.body
  const img = await loadImage(req.file.path);

  const canvas = createCanvas(img.width, img.height);
  const px = new pixelit({
    from: img,
    to: canvas,
    palette: 7,
    scale: 25
  });
  px.pixelate();
  px.convertPalette();
  px.resizeImage();
  const buffer = px.drawto.toBuffer("image/png");
//   fs.writeFileSync(argv.output, buffer);
  res.send(buffer);
});

module.exports = router;
