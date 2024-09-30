"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memes_get = void 0;
const debug = require('debug')('Server:memes');
const memes_1 = require("../../services/memes");
const memes_get = async (req, res) => {
    const id = parseInt(req.params.id);
    const nsfw = req.query.nsfw === "1";
    let url = await (isNaN(id) ? memes_1.MemeService.getMemeUrl(nsfw) : memes_1.MemeService.getMemeUrl(nsfw, id));
    res.json({ url });
};
exports.memes_get = memes_get;
//# sourceMappingURL=memes.js.map