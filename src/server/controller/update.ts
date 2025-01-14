const debug = require("debug")("Server:Update");

import { Request, Response } from "express";
import { UpdateService } from "services/update";

import {BOT_VERSION} from "@config";
import { isUpdate } from "@models";

export async function update_get_latest(_1: Request, res: Response){
    debug(`getting update v${BOT_VERSION}`);

    const latest = UpdateService.getUpdate(BOT_VERSION);

    res.json(latest);
}

export async function update_get(req: Request, res: Response){
    const version = req.params.version;

    debug(`getting update v${version}`);

    if(typeof version === "string"){
        const update = UpdateService.getUpdate(version);
        res.json(update);
    }
    else
        res.status(400).json({error: "invalid version"});
}

export async function update_get_all(_: Request, res: Response){
    debug("getting all updates");

    const updates = await UpdateService.getAllUpdate();

    res.json(updates);
}

export async function update_post_add(req: Request, res: Response){
    debug("adding new update");

    const update = req.body.update as unknown;

    if(!isUpdate(update))
        throw new Error("invalid update object");

    // should be already ensured here
    const updateRes = await UpdateService.addUpdate(update);
    res.json({updateRes});
}

export async function update_post_update(req: Request, res: Response){
    const version = req.body.version as unknown;
    const update = req.body.update as unknown;

    debug(`editing update v${version}`);

    if(typeof version !== "string")
        throw new Error("invalid version");

    if(typeof update !== "object" || update === null)
        throw new Error("invalid update object");

    const updated = await UpdateService.editUpdate(version, update);

    if(!updated)
        throw new Error("version not found");

    res.json(updated);
}

export async function update_post_delete(req: Request, res: Response){
    const version = req.body.version as unknown;

    debug(`deleting update v${version}`);

    if(typeof version !== "string")
        throw new Error("invalid version");

    await UpdateService.deleteUpdate(version);
    res.json({success: true});
}