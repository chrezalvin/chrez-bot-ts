import {inlineCommandReturnTypes, MyEmbedBuilder, rngInt} from "@library";

import pewpew from "@assets/messages/inline/pewpew.json";

const command: inlineCommandReturnTypes = {
    name: "pewpew",
    description: "Give pewpew",
    searchCriteria: ["pewpew", "pew", "pew pew", "mamekwpqnseueurbdudlalzmaa"],
    execute: (message) => {
        const embed = new MyEmbedBuilder()
            .setTitle(pewpew[rngInt(0, pewpew.length - 1)]);
        message.channel.send({embeds: [embed]});
    },
};

export default command;