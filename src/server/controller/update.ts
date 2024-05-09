import { NextFunction, Request, Response } from "express";
import { I_Update, UpdateService } from "services/update";

import {botVersion} from "@config";

export async function update_get_latest(_1: Request, res: Response, _2: NextFunction){
    const latest = UpdateService.getUpdate(botVersion);

    res.json(latest);
}

export async function update_get(req: Request, res: Response, _: NextFunction){
    const version = req.params.version;

    if(typeof version === "string"){
        const update = UpdateService.getUpdate(version);
        res.json(update);
    }
    else
        res.status(400).json({error: "invalid version"});
}

export async function update_get_all(req: Request, res: Response, _: NextFunction){
    const updates = await UpdateService.getAllUpdate();

    res.json(updates);
}

export async function update_add(req: Request, res: Response, _: NextFunction){
    const version = req.body.version as unknown;
    const update = req.body.update as unknown;

    if(!UpdateService.isUpdate(update) || !(typeof version === "string"))
        res.status(400).json({error: "invalid update object"});

    // should be already ensured here
    await UpdateService.addUpdate(version as string, update as I_Update);
    res.json({success: true});
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