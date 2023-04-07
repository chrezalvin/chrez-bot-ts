import {inlineCommandReturnTypes} from "@typings/customTypes";

import pewpew from "@assets/messages/inline/pewpew.json";
import { MyEmbedBuilder, rngInt } from "@modules/basicFunctions";

const command: inlineCommandReturnTypes = {
    name: "pewpew",
    description: "Give pewpew",
    searchCriteria: ["pewpew", "pew", "pew pew"],
    execute: (message) => {
        const embed = new MyEmbedBuilder()
            .setTitle(pewpew[rngInt(0, pewpew.length - 1)]);
        message.channel.send({embeds: [embed]});
    },
};

export default command;