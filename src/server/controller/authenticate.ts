const debug = require("debug")("Server:authenticate");

import { Request, Response } from "express";
import { OAUTH2_REDIRECT_URL, OAUTH2_REDIRECT_URL_SERVER } from "@config";

import { requestOauth2, collectUserData } from "services/authenticate";
import { UserService } from "@services/users";
import SessionService from "@services/session";
import client from "@bot";
import { isDiscordUser } from "@models/DiscordUser";

/**
 * authenticate user through discord oauth2, returns session_key
 */
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

/**
 * authenticate the user without needing a redirect to the browser, used only on postman testing
 */
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

/**
 * gets the user profile via the provided session key
 */
export async function getUserProfile(req: Request, res: Response){
  // this error should not be thrown since the sessionCheck middleware should have already checked this
  if(req.user === undefined)
    throw new Error("no session_key provided");

  res.json(req.user);
}

/**
 * gets discord profile of the user, based on user's session key
 */
export async function get_discord_profile(req: Request, res: Response){
  // this error should not be thrown since the sessionCheck middleware should have already checked this
  if(req.user === undefined)
    throw new Error("no session_key provided");

  const user = await client.users.fetch(req.user.id) as unknown;

  if(isDiscordUser(user))
    res.json(user);
  else
    throw new Error("Failed to fetch user");
};