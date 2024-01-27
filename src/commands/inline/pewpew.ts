import {inlineCommandReturnTypes} from "library/customTypes";

import pewpew from "@assets/messages/inline/pewpew.json";
import { MyEmbedBuilder, rngInt } from "@library/basicFunctions";

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