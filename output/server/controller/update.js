"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_get_latest = update_get_latest;
exports.update_get = update_get;
exports.update_get_all = update_get_all;
exports.update_add = update_add;
const update_1 = require("../../services/update");
const _config_1 = require("../../config");
const _models_1 = require("../../models");
async function update_get_latest(_1, res, _2) {
    const latest = update_1.UpdateService.getUpdate(_config_1.botVersion);
    res.json(latest);
}
async function update_get(req, res, _) {
    const version = req.params.version;
    if (typeof version === "string") {
        const update = update_1.UpdateService.getUpdate(version);
        res.json(update);
    }
    else
        res.status(400).json({ error: "invalid version" });
}
async function update_get_all(req, res, _) {
    const updates = await update_1.UpdateService.getAllUpdate();
    res.json(updates);
}
async function update_add(req, res, _) {
    const version = req.body.version;
    const update = req.body.update;
    if (!(0, _models_1.isUpdate)(update) || !(typeof version === "string"))
        res.status(400).json({ error: "invalid update object" });
    // should be already ensured here
    await update_1.UpdateService.addUpdate(version, update);
    res.json({ success: true });
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
//# sourceMappingURL=update.js.map