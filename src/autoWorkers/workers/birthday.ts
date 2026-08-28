// birthday responder
const debug = require("debug")("ChrezBot:birthday");

import { CronJob } from "cron";

import { MyEmbedBuilder } from "@library";
import { type TextChannel, Client } from "discord.js";
import { DiscordUserViewService } from "@services/supabase/services";

export default async function birthday(client: Client<boolean>){
    new CronJob("0 8 * * *", async () => {
        debug("checking birthdays for today");

        const today = new Date();
        const birthdayUsers = await DiscordUserViewService.getDiscordUsers({
            birthday: {
                day: today.getDay(),
                month: today.getMonth()
            }
        });

        for(const user of birthdayUsers){
            // send to crystal phoenix
            const ch = await client.channels.fetch("739696962097512452");

            const embed = new MyEmbedBuilder({
                title: `${user.username} is having a birthday!`,
                description: `Happy Birthday ${user.username}!`
            });
            
            if(ch)
                await (ch as TextChannel).send({embeds: [embed]});
        }

    }, null, true, "Japan");
}