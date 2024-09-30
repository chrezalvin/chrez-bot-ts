"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LickService = void 0;
const _library_1 = require("../library");
const _library_2 = require("../library");
class LickService {
    static getLickUrl(index) {
        const rand = index ?? (0, _library_1.rngInt)(0, LickService.fileManager.length - 1);
        return LickService.fileManager.get(rand);
    }
}
exports.LickService = LickService;
LickService.imgPath = "licks";
LickService.bucket = "images";
LickService.fileManager = new _library_2.FileManagerSupabase(LickService.bucket, LickService.imgPath);
//# sourceMappingURL=lick.js.map