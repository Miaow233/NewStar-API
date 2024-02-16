function other_code(req, res, next) {
	res.code = function (code) {
		res.status(code);
		res.send();
	};
	next();
}

module.exports = other_code;
