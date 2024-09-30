"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyEmbedBuilder = void 0;
const _config_1 = require("../config");
const discord_js_1 = require("discord.js");
class MyEmbedBuilder extends discord_js_1.EmbedBuilder {
    static createError(data) {
        const embed = new MyEmbedBuilder()
            .setTitle(data.title ?? ":warning:     error   :warning:")
            .setDescription(data.description)
            .setFooter({ text: data.footer ?? `for command list, type ${_config_1.prefixes[0]} help!` })
            .setColor("Red");
        return embed;
    }
    constructor(data) {
        super(data);
        if (!this.data.color)
            this.setColor("Yellow");
    }
}
exports.MyEmbedBuilder = MyEmbedBuilder;
//# sourceMappingURL=MyEmbedBuilder.js.map