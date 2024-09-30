"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursedService = void 0;
const _library_1 = require("../library");
const _library_2 = require("../library");
class CursedService {
    static getCursedList() {
        return CursedService.fileManager.cache;
    }
    static getCursedUrl(index) {
        let rand = index ?? (0, _library_1.rngInt)(0, CursedService.fileManager.length - 1);
        return CursedService.fileManager.get(rand);
    }
}
exports.CursedService = CursedService;
CursedService.imgPath = "cursed";
CursedService.imgBucket = "images";
CursedService.fileManager = new _library_2.FileManagerSupabase(CursedService.imgBucket, CursedService.imgPath);
//# sourceMappingURL=cursed.js.map