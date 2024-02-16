function custom_out_put(req, res, next) {
	res.put = function (data, code = 200) {
		// 获取back_type 默认"json"
		const back_type = req.query.back_type || "json";

		// 定义输出结果
		const result = {
			code: code,
			state: code == 200 ? "success" : "failure",
			data: data,
		};
		if (back_type === "string") {
			res.send(JSON.stringify(result));
			return;
		}
		if (back_type === "json") {
			res.status(code).send(result);
			return;
		}
		if (back_type === "img") {
			if (result.data.imgurl) {
				res.redirect(result.data.imgurl);
				return;
			} else {
				// "本接口未适配back_type = img"
				res.code(761);
				return;
			}
		}
		res.send("1");
	};
	next();
}

module.exports = custom_out_put;
