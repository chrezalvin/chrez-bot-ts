import {inlineCommandReturnTypes} from "@typings/customTypes";
import { AttachmentBuilder, MessageCreateOptions, MessagePayload } from "discord.js";
import path from "path";
import fs from "fs";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";

const licks_dir = path.resolve("./images/licks");
const licks = fs.readdirSync(licks_dir);

const arrayOfFunctions: (string | (() => (MessagePayload | MessageCreateOptions)))[] = [
    () => {
        const attachment = new AttachmentBuilder(`${licks_dir}/${licks[rngInt(0, licks.length - 1)]}`, {name: "licks.jpg"});
        const embed = new MyEmbedBuilder({title: "licks", footer: {text: ""}}).setImage("attachment://licks.jpg");
        return {embeds: [embed], files: [attachment]};
    },
    "ahh.....",
    "nghh...",
    "ahh... so good...",
    "tasty~",
    "yum~"
]

const command: inlineCommandReturnTypes = {
    name: "lick",
    searchCriteria: ["lick", /^lick(s) \w{1,6}$/, /^(licks? ?){1,3}/],
    description: "lick stuffs",
    execute: async (message) => {
        const strOrFunc = arrayOfFunctions[0];
        if(typeof strOrFunc === "string")
            await message.channel.send(strOrFunc);
        else
            await message.channel.send(strOrFunc());
    }
};

export default command;