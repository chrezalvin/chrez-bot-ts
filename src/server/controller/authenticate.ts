const debug = require("debug")("Server:authenticate");

import { Request, Response } from "express";
import { OAUTH2_REDIRECT_URL, OAUTH2_REDIRECT_URL_SERVER } from "@config";

import { requestOauth2, collectUserData } from "services/authenticate";
import { UserService } from "@services/users";
import SessionService from "@services/session";

export async function authenticate_get(req: Request, res: Response){
  debug("authenticate_get");
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

  if(!await UserService.userIsAdmin(user.id)){
    debug(`user ${user.username} tried to login but is not an admin`);
    throw new Error("User is not an admin");
  }

  debug(`collected user ${user.username} - ${user.id}`);

  const session = await SessionService.setNewSession(user.id);
  
  res.json({
    SESSION_KEY: session.id
  });
}

export async function authenticate_post(req: Request, res: Response){
  if(req.body.SESSION_KEY === undefined)
    throw new Error("no SESSION_KEY provided");

  debug(`authenticating user with SESSION_KEY: ${req.body.SESSION_KEY}`);

  const SESSION_KEY = req.body.SESSION_KEY;
  const found = await SessionService.getSession(SESSION_KEY);

  debug(`got sessionkey for user ${found.username}`);
  res.json(found);
}

export async function authenticate_server(req: Request, res: Response){
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
  const resSession  = await SessionService.setNewSession(user.id);

  if(!await UserService.userIsAdmin(user.id)){
    debug(`user ${user.username} tried to login but is not admin`);
    throw new Error("User is not an admin");
  }

  debug(`collected user ${user.username} - ${user.id}`);

  res.json({SESSION_KEY: resSession.id});
}

export async function getUserProfile(req: Request, res: Response){
  if(!req.cookies.sessionid || typeof req.cookies.sessionid !== "string")
    res.status(401).send({error: 401, message: "Unauthorized!"});

  const sessionid = req.cookies.sessionid;
  const session = await SessionService.getSession(sessionid);

  res.json(session);
}