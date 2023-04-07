import {inlineCommandReturnTypes} from "@typings/customTypes";

import greet from "@assets/messages/inline/greet.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";

const command: inlineCommandReturnTypes = {
    name: "greet",
    description: "Greet the user",
    searchCriteria: ["Chrez", "cb", "cheese", "here"],
    execute: (message) => {
        const embed = new MyEmbedBuilder()
            .setTitle(`Chrezbot greets ${message.author.username}`)
            .setDescription(greet[rngInt(0, greet.length - 1)].replace("[name]", message.author.username));

        message.channel.send({embeds: [embed]});
    },
};

export default command;