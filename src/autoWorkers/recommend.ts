// birthday responder
const debug = require("debug")("ChrezBot:birthday");

import { CronJob } from "cron";

import { MyEmbedBuilder, rngInt } from "@library";
import { type TextChannel, Client } from "discord.js";
import { getAllRecommend } from "services/recommend";

export default function recommend(client: Client<boolean>){
    // send recommendation to crystal phoenix every 12:00 am and pm
    new CronJob("0 0,12 * * *", async () => {
        // send to crystal phoenix
        const ch = await client.channels.fetch("739696962097512452");

        const recommends = await getAllRecommend();

        const recommend = recommends[rngInt(0, recommends.length - 1)];

        const embed = new MyEmbedBuilder({
            title: recommend.data.title,
            description: recommend.data.description
        });

        if(recommend.data.link)
            embed.setURL(recommend.data.link);

        if(recommend.data.imgUrl)
            embed.setImage(recommend.data.imgUrl);

        if(recommend.data.category)
            embed.setFooter({text: `Category: ${recommend.data.category.join(", ")}`});

        if(ch)
            await (ch as TextChannel).send({content: `recommendation of the day`, embeds: [embed]});
    }, null, true, "Japan");
}