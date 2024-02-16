const express = require("express");
const router = express.Router();

// 定义路由
// req是请求 res是响应
router.get("/", (req, res) => {
    const json = {
        "status": "ok"
    };
    res.json(json);
});

module.exports = router;
