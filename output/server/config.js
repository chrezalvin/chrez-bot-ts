"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const _config_1 = require("../config");
const express = (0, express_1.default)();
express.use((0, cors_1.default)());
express.use((0, morgan_1.default)("dev"));
express.use(express_1.default.json());
express.use(express_1.default.urlencoded());
express.use((0, cookie_parser_1.default)());
for (const route of routes_1.default) {
    express.use(route);
}
// catch 404 and forward to error handler
express.use(function (req, res, next) {
    res.json({ error: 404, message: "page not found" });
});
// error handler
express.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = _config_1.MODE === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = express;
