"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateService = void 0;
const _library_1 = require("../library");
const _models_1 = require("../models");
class UpdateService {
    static isUpdate(obj) {
        if (typeof obj !== "object" || obj === null)
            return false;
        // update can have either news or bugfix or both
        if ("news" in obj && "bugfix" in obj)
            return true;
        else if ("news" in obj && !("bugfix" in obj))
            return true;
        else if (!("news" in obj) && "bugfix" in obj)
            return true;
        else
            return false;
    }
    static async getUpdate(version) {
        const find = await UpdateService.serviceSupabase.get(version);
        if (!find)
            throw new Error("version not found");
        // return first occurence
        return find;
    }
    static async getAllUpdate() {
        const allData = await UpdateService.serviceSupabase.getAll();
        const arr = Array.from(allData.values());
        return arr;
    }
    static async deleteUpdate(version) {
        const find = await UpdateService.serviceSupabase.get(version);
        if (!find)
            throw new Error("version not found");
        await UpdateService.serviceSupabase.delete(version);
    }
    static async addUpdate(version, update) {
        await UpdateService.serviceSupabase.add(update);
    }
    static async editUpdate(version, update) {
        return await UpdateService.serviceSupabase.update(version, update);
    }
}
exports.UpdateService = UpdateService;
UpdateService.dbName = "updates";
UpdateService.serviceSupabase = new _library_1.ServiceSupabase("version", UpdateService.dbName, { typeGuard: _models_1.isUpdate, });
//# sourceMappingURL=update.js.map