import { NextFunction, Request, Response } from "express";
import { UpdateService } from "services/update";

import {botVersion} from "@config";

export async function update_get(req: Request, res: Response, next: NextFunction){
    const version = req.params.version;

    if(typeof version === "string"){
        const update = UpdateService.getUpdate(version);
        res.json(update);
    }
    else
        res.status(400).json({error: "invalid version"});
}

export async function update_get_all(req: Request, res: Response, next: NextFunction){
    const updates = await UpdateService.getAllUpdate();

    res.json(updates);
}

// export async function update_post_add(req: Request, res: Response, next: NextFunction){
//     const update = JSON.parse(req.body.update);

//     if(isUpdate(update)){
//         const isSuccess = await addNewUpdate(update);

//         res.json({success: isSuccess});
//     }
//     else
//         throw new Error("invalid update object");
// }