import { RouterInterface } from "@library";
import { NextFunction, Request, Response } from "express";

/**
 * middleware for checking up access type of user
 * @param accessType access type of the route private by default
 */
export function checkAccessType(accessType: RouterInterface["accessType"] = "private"){
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        // non-admin user can't access private routes
        if(user?.role === undefined)
            if(accessType === "public") 
                return next();
            else
                return res.status(401).send({error: 401, message: "Unauthorized!"});

        switch(user?.role){
            // owner can access all routes
            case "owner": return next();

            // vice can access all routes except owner
            case "vice": if(accessType === "owner") return res.status(401).send({error: 401, message: "Unauthorized!"}); return next();

            // admin can access all routes except owner and vice
            case "admin": if(accessType === "owner" || accessType === "vice") return res.status(401).send({error: 401, message: "Unauthorized!"}); return next();

            // default is private
            default: return res.status(401).send({error: 401, message: "Unauthorized!"});
        }
    }
}