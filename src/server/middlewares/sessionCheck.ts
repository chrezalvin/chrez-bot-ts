const debug = require("debug")("app:sessionCheck");

import { sessions } from "@shared";
import { NextFunction, Request, RequestHandler, Response } from "express";

export function sessionCheck(): RequestHandler{
    return (req: Request, res: Response, next: NextFunction) => {        
        // check if session is set
        const sessionid = req.cookies.sessionid as unknown;

        if(!sessionid)
            debug("no sessionid found");
        else
            debug(`sessionid found: ${sessionid}`);

        req.user = sessions.get(sessionid as string);
        next();
    }
}