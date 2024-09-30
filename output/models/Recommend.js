"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecommend = isRecommend;
function isRecommend(obj) {
    if (typeof obj !== "object" || obj === null)
        return false;
    if (!("title" in obj) || !("description" in obj))
        return false;
    return obj.title !== undefined && obj.description !== undefined;
}
//# sourceMappingURL=Recommend.js.map