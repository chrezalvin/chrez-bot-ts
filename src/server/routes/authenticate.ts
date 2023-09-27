const debug = require("debug")("Server:authenticate");

import { Request, Router } from "express";
import profiles from "@assets/data/profiles.json";
import { CLIENT_ID, CLIENT_SECRET } from "@config";
import { OAuth2Scopes, RESTPostOAuth2AccessTokenResult, DiscordjsError, User, APIUser } from "discord.js";
import { generateRandomString } from "server/sessions";
import {SessionStore} from "../sessions";


import {request} from "undici";

const router = Router();

interface My_User{
    username: string;
    discordID: string;
    avatarURL?: string;
}

const sessions = new SessionStore<My_User>();

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
        debug(`Statuscode 400 error given, reason: ${errorJson.error ?? "no reason found"}`);
        throw errorJson;
      }
  
      const res = await tokenResponseData.body.json();
  
      return res;
  }
  
  async function collectUserData(opt: {token_type: string, access_token: string}): Promise<APIUser>{
      const userResult = await request('https://discord.com/api/users/@me', {
                headers: {
                  authorization: `${opt.token_type} ${opt.access_token}`,
                },
              });
      if(userResult.statusCode === 400){
        const errorJson = await userResult.body.json();
        debug(`Statuscode 400 error given, reason: ${errorJson.error ?? "no reason found"}`);
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
          redirect_uri: `http://localhost:3001/Authenticate`,
          scope: "Identify"
        });
    
        const user = await collectUserData(oauth2Response);

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