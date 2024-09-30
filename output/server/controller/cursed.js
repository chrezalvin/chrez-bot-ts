"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursed_get = void 0;
const debug = require('debug')('Server:cursed');
const cursed_1 = require("../../services/cursed");
const cursed_get = async (req, res) => {
    const id = parseInt(req.params.index);
    let url = await cursed_1.CursedService.getCursedUrl(isNaN(id) ? undefined : id);
    res.json({ url });
};
exports.cursed_get = cursed_get;
//# sourceMappingURL=cursed.js.map