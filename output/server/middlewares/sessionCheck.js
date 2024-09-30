"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCheck = sessionCheck;
const debug = require("debug")("app:sessionCheck");
const _shared_1 = require("../../shared");
function sessionCheck() {
    return (req, res, next) => {
        // check if session is set
        const sessionid = req.cookies.sessionid;
        if (!sessionid)
            debug("no sessionid found");
        else
            debug(`sessionid found: ${sessionid}`);
        req.user = _shared_1.sessions.get(sessionid);
        next();
    };
}
//# sourceMappingURL=sessionCheck.js.map