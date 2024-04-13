const debug = require("debug")("Server:events");
import Express, { NextFunction, Response, Request } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import {sessions} from "@shared/UserSessions";

import routes from "./routes";
import { UserService } from "@services/users";

const express = Express();

express.use(cors());
express.use(logger("dev"));
express.use(Express.json());
express.use(Express.urlencoded());
express.use(cookieParser());

express.use(async (req, res, next) => {
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
    const user = sessions.getData(sessionid);

    //  check if user is admin
    if(user !== undefined){
        if(!UserService.userIsAdmin(user)) {
            debug(`user ${user.username} tried to login but is not an admin`);
            return res.status(401).send({error: 401, message: "Unauthorized!"});
        }

        debug(`session is valid, profile: ${user.username}`);
        return next();
    }

    // sends an error if session is not set
    return res.status(401).send({error: 401, message: "Unauthorized!"});
});

// logger
// if(MODE === "development"){
//     debug("dev mode, skipping session check");
//     express.use((_req, _res, next) => {
//         next();
//     });
// }

express.use(routes);

// catch 404 and forward to error handler
express.use(function(req, res, next) {
    res.json({error: 404, message: "page not found"});
});

function discordError(err: unknown): err is {error: string, error_description: string}{
    if(err === null || typeof err !== "object") return false;

    if("error" in err && typeof err.error === "string")
        if("error_description" in err && typeof err.error_description === "string")
            return true;
    
    return false;
}
  
// error handler
express.use(function(err: any, _req: Request, res: Response, _next: NextFunction) {
    res.status(err.status || 400);
    if(err instanceof Error){
        return res.send({error: 0, message: err.message});
    }
    if(discordError(err)){
        return res.send({...err})
    }

    return res.send({message: "Unknown Error!", error: err});
});

export default express;