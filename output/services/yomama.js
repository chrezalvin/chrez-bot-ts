"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YomamaService = void 0;
const _library_1 = require("../library");
const _library_2 = require("../library");
const _models_1 = require("../models");
class YomamaService {
    static async getYomama(index) {
        const idx = index ?? (0, _library_1.rngInt)(0, YomamaService.service.cache.length - 1);
        return await YomamaService.service.get(idx);
    }
}
exports.YomamaService = YomamaService;
YomamaService.tableName = "yomama";
YomamaService.service = new _library_2.ServiceSupabase("id", YomamaService.tableName, { typeGuard: _models_1.isYomama });
exports.default = YomamaService;
//# sourceMappingURL=yomama.js.map