const debug = require("debug")("Server:sessionCheck");

import { UserService } from "@services";
import SessionService from "@services/session";
import { NextFunction, Request, RequestHandler, Response } from "express";

export function sessionCheck(): RequestHandler{
    return async (req: Request, res: Response, next: NextFunction) => {    
        // check if session is set
        const sessionid = req.cookies.session_key as unknown;

        if(!sessionid)
            debug(`no sessionid found`);
        else
            debug(`sessionid found: ${sessionid}`);

        try{
            if(typeof sessionid === "string"){
                // ensures that no session-exclusive properties can be accessed
                const session = await SessionService.getSession(sessionid);

                // req user must be only be of User type
                req.user = await UserService.getUser(session.user_id);
            }

            next();
        }
        catch(err){
            res.status(401).send({error: 401, message: "Unknown error"});
        }
    }
}