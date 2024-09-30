"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDie = isDie;
function isDie(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("id" in value) || typeof value.id !== "number")
        return false;
    if (!("message" in value) || typeof value.message !== "string")
        return false;
    if (!("role" in value) || typeof value.role !== "number")
        return false;
    return true;
}
//# sourceMappingURL=Die.js.map