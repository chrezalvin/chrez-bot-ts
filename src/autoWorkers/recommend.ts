// birthday responder
const debug = require("debug")("ChrezBot:recommend");

import { CronJob } from "cron";

import { MyEmbedBuilder, rngInt } from "@library";
import { type TextChannel, Client } from "discord.js";
import { RecommendService } from "services/recommend";

export default function recommend(client: Client<boolean>){
    // send recommendation to crystal phoenix every 12:00 am and pm
    new CronJob("0 0 * * *", async () => {
        debug("sending recommendation to crystal phoenix");

        // send to crystal phoenix
        const ch = await client.channels.fetch("739696962097512452");

        const recommends = await RecommendService.recommendSupabase.getAll();

        const recommend = recommends[rngInt(0, recommends.length - 1)];

        const embed = new MyEmbedBuilder({
            title: recommend.title,
            description: recommend.description
        });

        if(recommend.imgUrl)
            embed.setThumbnail(recommend.imgUrl);

        if(recommend.link)
            embed.setURL(recommend.link);

        if(recommend.category)
            embed.setFooter({text: `Category: ${recommend.category.join(", ")}`});

        if(ch)
            await (ch as TextChannel).send({content: `recommendation of the day`, embeds: [embed]});
    }, null, true, "Japan");
}