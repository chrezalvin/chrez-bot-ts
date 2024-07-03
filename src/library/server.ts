const debug = require("debug")("Server:error");

import { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncErrorHandler(
    fn: RequestHandler
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (err) {
                if(err instanceof Error){
                    debug(`error occured: ${err.message}`);
                    res
                    .status(400)
                    .json({
                        error: 0,
                        message: err.message
                    });
                }
                else{
                    debug(`unknown error occured: ${err}`);
                    res
                    .status(400)
                    .json({
                        error: "Unknown Error!"
                    });
                }
            }
        }
    }