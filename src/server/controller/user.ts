const debug = require("debug")("Server:Users");

import { UserService } from "@services/users";
import { Request, Response } from "express";

export async function getUserById(req: Request, res: Response){
    const id = req.params.userid;

    debug(`getting user with id: ${id}`);

    if(typeof id === "string"){
        const user = await UserService.getUser(id);

        res.json(user);
    }
}