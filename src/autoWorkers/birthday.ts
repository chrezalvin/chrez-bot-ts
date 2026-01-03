// birthday responder
const debug = require("debug")("ChrezBot:birthday");

import { CronJob } from "cron";

import { MyEmbedBuilder } from "@library";
import { type TextChannel, Client } from "discord.js";
import { UserService } from "@services";

// name of month
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function birthday(client: Client<boolean>){
    new CronJob("0 8 * * *", async () => {
        debug("checking birthdays for today");

        const birthdayUsers = UserService.findBirthdayUsers();

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