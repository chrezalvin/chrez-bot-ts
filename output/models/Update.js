"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpdate = isUpdate;
function isUpdate(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("version" in value) || typeof value.version !== "string")
        return false;
    if (!("bugfix" in value) || (!Array.isArray(value.bugfix) && value.bugfix !== null))
        return false;
    if (!("news" in value) || (!Array.isArray(value.news) && value.news !== null))
        return false;
    return true;
}
//# sourceMappingURL=Update.js.map