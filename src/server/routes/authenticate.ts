const debug = require("debug")("Server:authenticate");

import { Request, Router } from "express";
import { CLIENT_ID, CLIENT_SECRET, OAUTH2_REDIRECT_URL } from "@config";
import { OAuth2Scopes, RESTPostOAuth2AccessTokenResult, APIUser } from "discord.js";
import {SessionStore} from "../../library/sessions";
import {sessions} from "@shared/UserSessions";


import {request} from "undici";
import { userIsAdmin } from "@library/profiles";

const router = Router();

async function requestOauth2(
    opt:{
      code: string, 
      redirect_uri: string, 
      scope: keyof typeof OAuth2Scopes}
    ): Promise<RESTPostOAuth2AccessTokenResult>{
    const tokenResponseData = await request(
      'https://discord.com/api/oauth2/token',
      {
          method: 'POST',
          body: new URLSearchParams({
              ...opt,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              grant_type: 'authorization_code',
          }).toString(),
          headers: {
          'Content-Type': "application/x-www-form-urlencoded"
      }});
      if(tokenResponseData.statusCode === 400){
        const errorJson = await tokenResponseData.body.json();

        if(typeof errorJson === "object" && errorJson !== null && "error" in errorJson)
          debug(`Statuscode 400 error given, reason: ${errorJson.error ?? "no reason found"}`);
        else
          debug(`Statuscode 400 error given, reason: ${errorJson ?? "no reason found"}`)

        throw errorJson;
      }
  
      const res = await tokenResponseData.body.json();
  
      return res as RESTPostOAuth2AccessTokenResult;
  }
  
  async function collectUserData(opt: {token_type: string, access_token: string}): Promise<APIUser>{
    debug(`received a userdata ${opt}`);
      const userResult = await request('https://discord.com/api/users/@me', {
                headers: {
                  authorization: `${opt.token_type} ${opt.access_token}`,
                },
              });
      if(userResult.statusCode === 400){
        const errorJson = await userResult.body.json();

        if(typeof errorJson === "object" && errorJson !== null && "error" in errorJson)
          debug(`Statuscode 400 error given, reason: ${errorJson.error ?? "no reason found"}`);
        else
          debug(`Statuscode 400 error given, reason: ${errorJson ?? "no reason found"}`);
        throw errorJson;
      }
  
      const user = await userResult.body.json();
      if(isAPIUser(user))
        return user;
      else throw new Error("Couldnt find user");
  }

function isAPIUser(val: unknown): val is APIUser{
  if(val === null || typeof val !== "object") return false;

  if("accent_color" in val)
    if("avatar" in val)
      if("discriminator" in val && typeof val.discriminator === "string")
        if("id" in val && typeof val.id === "string")
          if("username" in val && typeof val.username === "string")
            return true;
        
  return false;
}

router.get("/authenticate", async (req: Request, res, next) => {
    try{
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

        if(!userIsAdmin(user.id)){
          debug(`user ${user.username} tried to login but is not admin`);
          throw new Error("User is not admin");
        }

        debug(`collected user ${user.username} - ${user.id}`);
        const SESSION_KEY = sessions.add({username: user.username, discordID: user.id, avatarURL: user.avatar ?? undefined});
        return res.json({SESSION_KEY});
      }catch(err: any){
        next(err);
      }
})

router.post("/authenticate", (req, res, next) => {
  try{
    if(req.body.SESSION_KEY !== undefined){
      const SESSION_KEY = req.body.SESSION_KEY;
      const find = sessions.get(SESSION_KEY);

      if(find){
        debug(`got sessionkey for user: ${find.value.username}`);
        return res.json(find.value);
      }
      else{
        debug(`cannot find the user from session_key`);
        throw new Error("SESSION_KEY not found");
      }
    }
    else
      throw new Error("no SESSION_KEY provided");
  }
  catch(err: any){
    next(err);
  }
})

export default router;