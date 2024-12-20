const debug = require("debug")("Server:sessionCheck");

import SessionService from "@services/session";
import { NextFunction, Request, RequestHandler, Response } from "express";

export function sessionCheck(): RequestHandler{
    return async (req: Request, res: Response, next: NextFunction) => {    
        // check if session is set
        const sessionid = req.cookies.SESSION_KEY as unknown;

        if(!sessionid)
            debug("no sessionid found");
        else
            debug(`sessionid found: ${sessionid}`);

        try{
            if(typeof sessionid === "string")
                req.user = await SessionService.getSession(sessionid);

            next();
        }
        catch(err){
            if(err instanceof Error)
                debug(`caught an error: ${err.message}`);
            else
                debug(`caught an unknown error: ${err}`);
            
            res.status(401).send({error: 401, message: "Unknown error"});
        }
    }
}