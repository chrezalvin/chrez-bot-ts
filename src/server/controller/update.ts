import { NextFunction, Request, Response } from "express";
import { UpdateService } from "services/update";

import {botVersion} from "@config";
import { isUpdate, Update } from "@models";

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

export async function update_post_add(req: Request, res: Response, _: NextFunction){
    const update = req.body.update as unknown;

    if(!isUpdate(update))
        throw new Error("invalid update object");

    // should be already ensured here
    const updateRes = await UpdateService.addUpdate(update);
    res.json({updateRes});
}

export async function update_post_update(req: Request, res: Response, _: NextFunction){
    const version = req.body.version as unknown;
    const update = req.body.update as unknown;

    if(typeof version !== "string")
        throw new Error("invalid version");

    if(typeof update !== "object" || update === null)
        throw new Error("invalid update object");

    const updated = await UpdateService.editUpdate(version, update);

    if(!updated)
        throw new Error("version not found");

    res.json(updated);
}

export async function update_post_delete(req: Request, res: Response, _: NextFunction){
    const version = req.body.version as unknown;

    if(typeof version !== "string")
        throw new Error("invalid version");

    await UpdateService.deleteUpdate(version);
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