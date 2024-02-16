let createError = require("http-errors");
const express = require("express");
const cors = require("cors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const fs = require("fs");
const PORT = require("./config").PORT;
const API_PATH = require("./config").API_PATH;
let http = require("http");

let app = express();

// 页面渲染引擎: jade
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 加载组件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // 跨域资源
app.use(express.static(path.join(__dirname, "public"))); // 静态资源开放

// 加载路由
let indexRouter = require("./routes/index");
app.use("/", indexRouter);

// 遍历加载所有 API
fs.readdirSync(API_PATH).forEach((apiName) => {
  try {
    // 加载每个 API 的 manifest
    let manifest = JSON.parse(
      fs.readFileSync(path.join(API_PATH, apiName, "manifest.json"))
    );

    if (manifest.open) {
      // 注册 API 路由
      const router = require(`./api/${apiName}`);
      app.use(`/api/${apiName}`, router);
      console.log(`API ${apiName} loaded`);
    }
  } catch (error) {
    console.error(`API ${apiName} load failed`, error);
  }
});

// 404页面
app.use(function (req, res, next) {
  next(createError(404));
});

// 异常处理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let port = normalizePort(process.env.PORT || PORT);
app.set("port", port);

let server = http.createServer(app);

// 启动服务器
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
server.on("error", onError);

function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
