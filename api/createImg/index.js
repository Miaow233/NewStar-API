const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");
const express = require("express");
const router = express.Router();

/**
 * Generates a random color from a predefined color library.
 *
 * @return {string} The randomly generated color.
 */
function rand_color() {
  // 颜色库
  const colors = [
    "#fff143",
    "#ed5736",
    "#0eb840",
    "#1bd1a5",
    "#e0eee8",
    "#7bcfa6",
    "#057748",
    "#75878a",
    "#75878a",
  ];
  // 随机值
  const random_index = Math.floor(Math.random() * colors.length); // 随机生成一个下标
  // 返回颜色
  return colors[random_index];
}

router.get("/", (req, res) => {
  const img_size = Number(req.query.img_size) || 256;
  const img_color = req.query.img_color || rand_color();
  const text = req.query.text || "I";
  const font_size =
    Number(req.query.font_size) || (img_size / text.length / 1.2).toFixed(2);
  const font_color = req.query.font_color || rand_color();
  const font_type = req.query.font_type || "weiruanyahei";
  const gradient = req.query.gradient || false;

  // 验证各参数
  // img_size范围在16-1080之间
  if (img_size <= 16 || img_size >= 1080) {
    // 待完成
  }

  // 创建 canvas
  const canvas = createCanvas(img_size, img_size);
  const ctx = canvas.getContext("2d");

  // 设置字体
  // registerFont("./server/font/FZYongKeTiS.ttf", { family: "weiruanyahei" }); // 替换为实际的字体文件路径和字体名称

  // 设置文本样式
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${font_size}px weiruanyahei`;

  // 填充整个Canvas背景颜色
  ctx.fillStyle = img_color; // 请替换为实际的背景颜色
  ctx.fillRect(0, 0, img_size, img_size);

  ctx.fillStyle = font_color; // 请替换为实际的文本颜色
  ctx.fillText(text, img_size / 2, img_size / 2);

  // 将Canvas转为图像数据(Buffer)
  const buffer = canvas.toBuffer();

  // 生成图像ID
  const img_name = `${new Date().getTime()}_${Math.floor(
    Math.random() * 10000
  )}`;

  // 绘制线性颜色(渐变色)
  // const gradient = ctx.createLinearGradient(0, 0, img_size, 0);
  // gradient.addColorStop(0, 'red');
  // gradient.addColorStop(1, 'blue');
  // ctx.fillStyle = gradient;
  // ctx.fillRect(0, 0, img_size, img_size);

  // 保存图片到指定路径
  fs.writeFileSync(`./public/image/${img_name}.png`, buffer);

  // 将 canvas 转换为图片数据
  // return canvas.toDataURL();

  res.redirect(`image/${img_name}.png`);
});

// 导出
module.exports = router;
