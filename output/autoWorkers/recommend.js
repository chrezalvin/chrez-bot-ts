"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = recommend;
// birthday responder
const debug = require("debug")("ChrezBot:recommend");
const cron_1 = require("cron");
const _library_1 = require("../library");
const recommend_1 = require("../services/recommend");
function recommend(client) {
    // send recommendation to crystal phoenix every 12:00 am and pm
    new cron_1.CronJob("0 0 * * *", async () => {
        // send to crystal phoenix
        const ch = await client.channels.fetch("739696962097512452");
        const recommends = await recommend_1.RecommendService.service.getAll();
        const recommend = recommends[(0, _library_1.rngInt)(0, recommends.length - 1)];
        const embed = new _library_1.MyEmbedBuilder({
            title: recommend.title,
            description: recommend.description
        });
        if (recommend.imgUrl)
            embed.setThumbnail(recommend.imgUrl);
        if (recommend.link)
            embed.setURL(recommend.link);
        if (recommend.category)
            embed.setFooter({ text: `Category: ${recommend.category.join(", ")}` });
        if (ch)
            await ch.send({ content: `recommendation of the day`, embeds: [embed] });
    }, null, true, "Japan");
}
//# sourceMappingURL=recommend.js.map