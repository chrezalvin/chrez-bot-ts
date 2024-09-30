"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = isUser;
function isUser(value) {
    if (value === null || typeof value !== "object")
        return false;
    if (!("id" in value) || typeof value.id !== "string")
        return false;
    if (!("username" in value) || typeof value.username !== "string")
        return false;
    if (!("timezone" in value) || (typeof value.timezone !== "string" && value.timezone !== null))
        return false;
    if (!("aliases" in value) || (!Array.isArray(value.aliases) && value.aliases !== null))
        return false;
    if (!("rolename" in value) || typeof value.rolename !== "string" || !["owner", "vice", "admin", "user"].includes(value.rolename))
        return false;
    return true;
}
//# sourceMappingURL=User.js.map