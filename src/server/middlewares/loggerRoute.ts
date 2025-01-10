const debug = require("debug")("Server:loggerRoute");
import { NextFunction, Request, RequestHandler, Response } from "express";

export function loggerRoute(): RequestHandler{
    return async (req: Request, res: Response, next: NextFunction) => {    
        debug(`${req.method} ${req.url}`);

        next();
    }
}