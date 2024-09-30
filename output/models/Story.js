"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStory = isStory;
function isStory(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("title" in value) || typeof value.title !== "string")
        return false;
    if (!("author" in value) || typeof value.author !== "string")
        return false;
    if (!("description" in value) || !Array.isArray(value.description))
        return false;
    if (!("footer" in value) || typeof value.footer !== "string" || value.footer === null)
        return false;
    if (!("footer" in value) || typeof value.footer !== "string")
        return false;
    return true;
}
//# sourceMappingURL=Story.js.map