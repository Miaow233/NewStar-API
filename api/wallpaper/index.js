const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

// 壁纸分类
const WallpaperCategoryType = {
  girl: "4e4d610cdf714d2966000000",
  animal: "4e4d610cdf714d2966000001",
  landscape: "4e4d610cdf714d2966000002",
  anime: "4e4d610cdf714d2966000003",
  drawn: "4e4d610cdf714d2966000004",
  mechanics: "4e4d610cdf714d2966000005",
  boy: "4e4d610cdf714d2966000006",
  game: "4e4d610cdf714d2966000007",
  text: "5109e04e48d5b9364ae9ac45",
};

const WallpaperOrderType = {
  // 壁纸排序方式

  hot: "hot", // 热门
  new: "new", // 最新
};

let base = "http://service.aibizhi.adesk.com";

async function wallpaper(category, limit, skip, adult, order) {
  return await axios.get(
    `${base}/v1/wallpaper/category/${category}/wallpaper`,
    {
      params: {
        limit: limit,
        skip: skip,
        adult: adult,
        order: order,
        first: 0,
        category: WallpaperCategoryType[category],
      },
    }
  );
}

router.get("/", async (req, res) => {
  let category = req.query.category;
  let limit = req.query.limit;
  let skip = req.query.skip;
  let adult = req.query.adult;
  let order = req.query.order;
  res.send(await wallpaper(category, limit, skip, adult, order));
});

module.exports = router;
