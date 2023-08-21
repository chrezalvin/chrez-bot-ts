// birthday responder

import { CronJob } from "cron";
import debug from "debug";

import profiles from "@assets/data/profiles.json";
import { MyEmbedBuilder } from "@modules/basicFunctions";
import { type TextChannel, Client } from "discord.js";

// name of month
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function birthday(client: Client<boolean>){
    for(const profile of profiles){
        if(profile.birthday){
            debug(`adding bday schedule for ${profile.name}`);
            const bday = profile.birthday;
            if(bday.day < 2){
                bday.day = 28; // assuming all month are 28 days lol
                --bday.month;
                if(bday.month === 0) bday.month = 12;
            }

            // 2 days from now
            // `0 8 ${bday.day} ${bday.month} *`
            new CronJob(`0 8 ${bday.day} ${bday.month} *`, async () => {
                // send to crystal phoenix
                const ch = await client.channels.fetch("739696962097512452");

                const embed = new MyEmbedBuilder({
                    title: `Somone is having a bday at ${monthNames[profile.birthday.month - 1]} ${profile.birthday.day}`,
                    description: "wonder who"
                })

                if(ch)
                    await (ch as TextChannel).send({embeds: [embed]});
            }, null, true, "Japan");

            new CronJob(`0 8 ${profile.birthday.day} ${profile.birthday.month} *`, async () => {
                // send to crystal phoenix
                const ch = await client.channels.fetch("739696962097512452");

                const embed = new MyEmbedBuilder({
                    title: `${profile.name} is having a birthday!`,
                    description: `cool`
                })

                if(ch)
                    await (ch as TextChannel).send({embeds: [embed]});
            }, null, true, "Japan");
        }
    }
}