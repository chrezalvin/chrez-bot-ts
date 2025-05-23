// const debug = require("debug")("Server:events");

import Express, { NextFunction, Response, Request } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes";
import { sessionCheck, page404, loggerRoute } from "./middlewares";
import { CORS_ORIGIN } from "@config";

const express = Express();

express.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
express.use(logger("dev"));
express.use(Express.json());
express.use(Express.urlencoded());
express.use(cookieParser());

express.use(loggerRoute());
express.use(sessionCheck());
express.use(routes);

// catch 404 and forward to error handler
express.use(page404());

function discordError(err: unknown): err is {error: string, error_description: string}{
    if(err === null || typeof err !== "object") return false;

    if("error" in err && typeof err.error === "string")
        if("error_description" in err && typeof err.error_description === "string")
            return true;
    
    return false;
}

// error handler
express.use(function(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.log(err);

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