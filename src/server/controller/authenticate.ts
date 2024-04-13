const debug = require("debug")("Server:authenticate");

import { NextFunction, Request, Response } from "express";
import { OAUTH2_REDIRECT_URL, OAUTH2_REDIRECT_URL_SERVER } from "@config";
import { sessions } from "@shared/UserSessions";
import crypto from "crypto";

import { requestOauth2, collectUserData } from "services/authenticate";
import { UserService } from "@services/users";

export async function authenticate_get(req: Request, res: Response, next: NextFunction){
  const accessCode = req.query.code;
  
  if(typeof accessCode !== "string"){
    debug("no accesscode error thrown");
    throw new Error("No accesscode given");
  }
  
  debug(`got accessCode ${accessCode}`);
  const oauth2Response = await requestOauth2({
    code: accessCode,
    redirect_uri: OAUTH2_REDIRECT_URL,
    scope: "Identify"
  });

  const user = await collectUserData(oauth2Response);
  const resUser = await UserService.getUser(user.id);

  if(!UserService.userIsAdmin(resUser)){
    debug(`user ${user.username} tried to login but is not an admin`);
    throw new Error("User is not an admin");
  }

  debug(`collected user ${user.username} - ${user.id}`);

  const sessionID = crypto.randomUUID();
  sessions.addData(sessionID, resUser);
  
  res.json({sessionID});
}

export async function authenticate_post(req: Request, res: Response, next: NextFunction){
  if(req.body.SESSION_KEY !== undefined){
    const SESSION_KEY = req.body.SESSION_KEY;
    const find = sessions.getData(SESSION_KEY);

    if(find){
      debug(`got sessionkey for user: ${find.username}`);
      res.json(find);
    }
    else{
      debug(`cannot find the user from session_key`);
      throw new Error("SESSION_KEY not found");
    }
  }
  else
    throw new Error("no SESSION_KEY provided");
}

export async function authenticate_server(req: Request, res: Response, next: NextFunction){
  const accessCode = req.query.code;
  
  if(typeof accessCode !== "string"){
    debug("no accesscode error thrown");
    throw new Error("No accesscode given");
  }
  
  debug(`got accessCode ${accessCode}`);
  const oauth2Response = await requestOauth2({
    code: accessCode,
    redirect_uri: OAUTH2_REDIRECT_URL_SERVER,
    scope: "Identify"
  });

  const user = await collectUserData(oauth2Response);
  const resUser = await UserService.getUser(user.id);

  if(!UserService.userIsAdmin(resUser)){
    debug(`user ${user.username} tried to login but is not admin`);
    throw new Error("User is not admin");
  }

  debug(`collected user ${user.username} - ${user.id}`);

  const sessionID = crypto.randomUUID();

  sessions.addData(sessionID, resUser);

  res.json({sessionID});
}

export async function getUserProfile(req: Request, res: Response, next: NextFunction){
  const sessionid = req.cookies.sessionid;

  if(typeof sessionid === "string"){
    const userSession = sessions.getData(sessionid);

    if(userSession !== undefined){
      res.json(userSession);
    }
    else
      res.status(401).send({error: 401, message: "Unauthorized!"});
  }
  else
    res.status(401).send({error: 401, message: "Unauthorized!"});
}