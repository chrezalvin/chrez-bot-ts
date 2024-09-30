"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = asyncErrorHandler;
const debug = require("debug")("Server:error");
function asyncErrorHandler(fn
// fn: ((req: Request, res: Response, next: NextFunction) => Promise<void> | ((req: Request, res: Response) => Promise<void>))
) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            if (err instanceof Error) {
                debug(`error occured: ${err.message}`);
                return res.status(400).json({
                    error: 0,
                    message: err.message
                });
            }
            else {
                debug(`unknown error occured: ${err}`);
                res.json({
                    error: "Unknown Error!"
                });
            }
        }
    };
}
//# sourceMappingURL=server.js.map