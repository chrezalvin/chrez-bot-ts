const debug = require("debug")("app:sessionCheck");

import { sessions } from "@shared";
import { NextFunction, Request, Response } from "express";

export default function sessionCheck(req: Request, res: Response, next: NextFunction){
    // special case for authentication, in this case we dont need to check the session
    if(req.path === "/authenticate" || req.path === "/authenticate_server" || req.method === "GET"){
        next();
        return;
    }

    if(!("sessionid" in req.cookies) || !(typeof req.cookies.sessionid === "string"))
        return res.status(401).send({error: 401, message: "Unauthorized!"});

    const sessionid = req.cookies.sessionid as string;

    debug(`got sessionid: ${sessionid}`);

    // check if session is set
    const userSession = sessions.find((session) => session.sessionID === sessionid);
    if(userSession !== undefined){
        debug(`session is valid, profile: ${userSession.username} - ${userSession.discordID}`);
        return next();
    }

    // sends an error if session is not set
    return res.status(401).send({error: 401, message: "Unauthorized!"});
}