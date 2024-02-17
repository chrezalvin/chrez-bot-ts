const debug = require("debug")("Server:authenticate");

import { NextFunction, Request, Response } from "express";
import { OAUTH2_REDIRECT_URL } from "@config";
import { sessions } from "@shared/UserSessions";

import { userIsAdmin } from "@library/profiles";
import { requestOauth2, collectUserData } from "services/authenticate";

export async function authenticate_get(req: Request, res: Response, next: NextFunction){
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
}

export async function authenticate_post(req: Request, res: Response, next: NextFunction){
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
}