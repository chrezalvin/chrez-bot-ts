// birthday responder
const debug = require("debug")("ChrezBot:birthday");

import { CronJob } from "cron";

import profiles from "@assets/data/profiles.json";
import { MyEmbedBuilder } from "@library";
import { type TextChannel, Client } from "discord.js";

// name of month
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function birthday(client: Client<boolean>){
    for(const profile of profiles){
        if(profile.birthday){
            debug(`adding bday schedule for ${profile.name}`);

            const date = new Date(profile.birthday.year ?? 2001, profile.birthday.month - 1, profile.birthday.day);
            const date2DaysBefore = new Date(profile.birthday.year ?? 2001, profile.birthday.month - 1, profile.birthday.day);
            date2DaysBefore.setDate(date2DaysBefore.getDate() - 2);

            new CronJob(`0 8 ${date2DaysBefore.getDate()} ${date2DaysBefore.getMonth()} *`, async () => {
                // send to crystal phoenix
                const ch = await client.channels.fetch("739696962097512452");

                const embed = new MyEmbedBuilder({
                    title: `Someone is having a birthday at ${monthNames[profile.birthday.month - 1]} ${profile.birthday.day}`,
                    description: "wonder who"
                })

                if(ch)
                    await (ch as TextChannel).send({embeds: [embed]});
            }, null, true, "Japan");

            new CronJob(`0 8 ${date.getDate()} ${date.getMonth()} *`, async () => {
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