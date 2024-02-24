import {inlineCommandReturnTypes, MyEmbedBuilder, rngInt} from "@library";

import greet from "@assets/messages/inline/greet.json";
import { prefixes } from "@config";

const command: inlineCommandReturnTypes = {
    name: "greet",
    description: "Greet the user",
    searchCriteria: ["cheese", /^he+re+$/i, ...prefixes],
    execute: (message) => {
        const embed = new MyEmbedBuilder()
            // .setTitle(`Chrezbot greets ${message.author.username}`)
            // .setDescription(greet[rngInt(0, greet.length - 1)].replace("[name]", message.author.username));

        message.channel.send(greet[rngInt(0, greet.length - 1)].replace("[name]", message.author.username));
    },
};

export default command;