import {inlineCommandReturnTypes} from "library/customTypes";
import { AttachmentBuilder, MessageCreateOptions, MessagePayload } from "discord.js";
import { MyEmbedBuilder, rngInt } from "@library/basicFunctions";

import path from "path";
import fs from "fs";

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
    "tasty",
    "yum"
]

const command: inlineCommandReturnTypes = {
    name: "lick",
    searchCriteria: ["lick", /^lick(s) \w{1,6}$/i, /^(licks? ?){1,3}/i],
    description: "lick stuffs",
    execute: async (message) => {
        const strOrFunc = arrayOfFunctions[rngInt(0, arrayOfFunctions.length - 1)];
        message.channel.send(typeof strOrFunc === "string" ? strOrFunc : strOrFunc());
    }
};

export default command;