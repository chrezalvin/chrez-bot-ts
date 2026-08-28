const debug = require("debug")("middleware:sessionCheck");

import { DiscordUserViewService } from "@services/supabase/services";
import { NextFunction, Request, RequestHandler, Response } from "express";

type UserRole = "owner" | "vice" | "admin" | "user";
export function requireUser(option?: {
    roles?: UserRole[]
}): RequestHandler{
    return async (req: Request, res: Response, next: NextFunction) => {    
        // check if session is set
        // const sessionid = req.cookies.session_key as unknown;
        const user = await DiscordUserViewService.getDiscordUser("");

        if(!user)
            throw new Error("User not found!");

        if(option?.roles){
            if(!option.roles.find(role => user.role === role))
                throw new Error("Permission rejected!");
        }

        req.user = user;

        next();
    }
}