"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemeService = void 0;
const _library_1 = require("../library");
const _library_2 = require("../library");
class MemeService {
    static getMemeList(nsfw = false) {
        if (nsfw)
            return MemeService.fileManagerNsfw.cache;
        else
            return MemeService.fileManagerSfw.cache;
    }
    static async getMemeUrl(nsfw = false, index) {
        const service = nsfw ? MemeService.fileManagerNsfw : MemeService.fileManagerSfw;
        const rand = service.cache[index ?? (0, _library_1.rngInt)(0, service.length - 1)];
        return rand;
    }
}
exports.MemeService = MemeService;
MemeService.memePathSfw = "memes/sfw";
MemeService.memePathNsfw = "memes/nsfw";
MemeService.bucketImage = "images";
MemeService.fileManagerNsfw = new _library_2.FileManagerSupabase(MemeService.bucketImage, MemeService.memePathNsfw);
MemeService.fileManagerSfw = new _library_2.FileManagerSupabase(MemeService.bucketImage, MemeService.memePathSfw);
//# sourceMappingURL=memes.js.map