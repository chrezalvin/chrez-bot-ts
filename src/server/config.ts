const debug = require("debug")("Server:events");
import Express, { NextFunction, Response, Request } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import {sessions} from "@shared/UserSessions";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

import routes from "./routes";

import {MODE, SESSION_SECRET} from "@config";

const express = Express();

express.use(cors());
express.use(logger("dev"));
express.use(Express.json());
express.use(Express.urlencoded());
express.use(cookieParser());
express.use(session({
    secret: SESSION_SECRET,
    // resave: false,
    // saveUninitialized: true,
    cookie: {secure: true, maxAge: 60},
    store: new MemoryStore({
        checkPeriod: 8640000,
    }),
    resave: false
}))

// logger
if(MODE === "development"){
    debug("dev mode, skipping session check");
    express.use((_req, _res, next) => {
        next();
    });
}

// middlware to check if user session is valid
express.use(async (req, res, next) => {
    // special case for authentication, in this case we dont need to check the session
    if(req.path === "/authenticate" || req.method === "GET"){
        next();
        return;
    }

    const session = req.body.cookie || req.body.SESSION_KEY;
    if(session && sessions.has(session))
        return next();
    else
        return res.status(401).send({error: 401, message: "Unauthorized!"});
});

for(const route of routes){
    express.use(route);
}

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