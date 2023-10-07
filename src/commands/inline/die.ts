import {CommandReturnTypes, inlineCommandReturnTypes} from "@typings/customTypes";
import { MessageType, SlashCommandBuilder } from "discord.js";

import dieMessages from "@assets/messages/inline/die.json";
import { rngInt } from "@modules/basicFunctions";
import { ownerID } from "@config";

const command: inlineCommandReturnTypes = {
    name: "die",
    searchCriteria: [/chrez die|die cheese/i],
    description: "Do random stuff (including deleting people >:D)",
    execute: async (message) => {
        let dieMessage: string  = "";

        if(message.author.id === ownerID)
            dieMessage = dieMessages.owner[rngInt(0, dieMessages.owner.length - 1)];
        else
            dieMessage = dieMessages.normal[rngInt(0, dieMessages.normal.length - 1)].replace("[name]", message.author.username);

        await message.channel.send(dieMessage);
    }
};

export default command;