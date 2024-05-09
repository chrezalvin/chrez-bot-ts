import { UserService } from "@services/users";
import { NextFunction, Request, Response } from "express";

export async function getUserById(req: Request, res: Response, next: NextFunction){
    const id = req.params.userid;

    if(typeof id === "string"){
        const user = await UserService.getUser(id);

        res.json(user);
    }
}

export function deleteUser(req: Request, res: Response, next: NextFunction){

}

export function updateUserRole(req: Request, res: Response, next: NextFunction){

}