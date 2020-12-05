var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const CustomError = require("./modules/CustomError");
const { sequelize } = require("./models");
const ut = require("./modules/util");

sequelize
    .sync({ force: true })
    .then(() => {
        console.log("데이터베이스 연결 성공.");
    })
    .catch(error => {
        console.error(error);
    });

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    console.log("app error");
    console.log(err.stack);
    if (err instanceof CustomError) {
        return res.status(err.status).json(ut.fail(err.status, err.message));
    }
    if (err instanceof createError.NotFound) {
        return res.status(err.status).json(ut.fail(err.status, err.message));
    }

    return res.status(500).json(ut.fail(500, "Internal Server Error"));
});

module.exports = app;
