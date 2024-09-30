"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page404 = page404;
function page404() {
    return (req, res, next) => {
        res.status(404).send("Page not found");
    };
}
//# sourceMappingURL=404.js.map