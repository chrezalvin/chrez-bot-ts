"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYomama = isYomama;
function isYomama(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("id" in value) || typeof value.id !== "number")
        return false;
    if (!("message" in value) || typeof value.message !== "string")
        return false;
    return true;
}
//# sourceMappingURL=Yomama.js.map