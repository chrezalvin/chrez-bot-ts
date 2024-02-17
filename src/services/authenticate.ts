const debug = require("debug")("Server:authenticate");

import { CLIENT_ID, CLIENT_SECRET } from "@config";
import { OAuth2Scopes, RESTPostOAuth2AccessTokenResult, APIUser } from "discord.js";
import { request } from "undici";

export async function requestOauth2(
    opt:{
      code: string, 
      redirect_uri: string, 
      scope: keyof typeof OAuth2Scopes
    }
    ): Promise<RESTPostOAuth2AccessTokenResult>
{
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
  
export async function collectUserData(opt: RESTPostOAuth2AccessTokenResult): Promise<APIUser>{
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

    if(isAPIUser(user)) return user;
    else throw new Error("Couldnt find user");
}

export function isAPIUser(val: unknown): val is APIUser {
    if(val === null || typeof val !== "object") return false;

    if("accent_color" in val)
        if("avatar" in val)
        if("discriminator" in val && typeof val.discriminator === "string")
            if("id" in val && typeof val.id === "string")
            if("username" in val && typeof val.username === "string")
                return true;
            
    return false;
}