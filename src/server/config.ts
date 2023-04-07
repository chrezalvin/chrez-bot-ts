import Express, { NextFunction } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes";

import {MODE} from "@config";

const express = Express();

express.use(cors());
express.use(logger("dev"));
express.use(Express.json());
express.use(Express.urlencoded());
express.use(cookieParser());

for(const route of routes){
    express.use(route);
}

// catch 404 and forward to error handler
express.use(function(req, res, next) {
    res.json({error: 404, message: "page not found"});
  });
  
// error handler
express.use(function(
    err: { message: any; status: any; }, 
    req: { app: { get: (arg0: string) => string; }; }, 
    res: { 
        locals: { message: any; error: any; }; 
        status: (arg0: any) => void; 
        render: (arg0: string) => void; 
    }, 
    next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = MODE === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default express;