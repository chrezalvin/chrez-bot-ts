import {InlineCommandReturnTypes, MyEmbedBuilder, rngInt} from "@library";
import { AttachmentBuilder, MessageCreateOptions, MessagePayload } from "discord.js";

import { LickService } from "services/lick";

const arrayOfFunctions: (string | (() => Promise<(MessagePayload | MessageCreateOptions)>))[] = [
    async () => {
        const lickUrl = await LickService.getLickUrl();

        const attachment = new AttachmentBuilder(lickUrl, {name: "licks.jpg"});
        const embed = new MyEmbedBuilder({title: "licks", footer: {text: ""}}).setImage("attachment://licks.jpg");
        return {embeds: [embed], files: [attachment]};
    },
    "ahh.....",
    "nghh...",
    "ahh... so good...",
    "tasty",
    "yum"
]

const command: InlineCommandReturnTypes = {
    name: "lick",
    searchCriteria: ["lick", /^lick(s) \w{1,6}$/i, /^(licks? ?){1,3}/i],
    description: "lick stuffs",
    execute: async (message) => {
        const strOrFunc = arrayOfFunctions[rngInt(0, arrayOfFunctions.length - 1)];
        message.channel.send(typeof strOrFunc === "string" ? strOrFunc : await strOrFunc());
    }
};

export default command;