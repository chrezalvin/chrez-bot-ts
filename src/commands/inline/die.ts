import {inlineCommandReturnTypes, rngInt} from "@library";
import { MessageType } from "discord.js";

import dieMessages from "@assets/messages/inline/die.json";
import { ownerID } from "@config";

const command: inlineCommandReturnTypes = {
    name: "die",
    searchCriteria: [/chrez die|die cheese/i, /^die$/i],
    description: "sending mean message to mean people >:(",
    execute: async (message) => {
        let dieMessage: string  = "";

        if(message.author.id === ownerID)
            dieMessage = dieMessages.owner[rngInt(0, dieMessages.owner.length - 1)];
        else
            dieMessage = dieMessages.normal[rngInt(0, dieMessages.normal.length - 1)].replace("[name]", message.author.username);

        if(message.type === MessageType.Reply)
            await message.reply(dieMessage);
        else if(message.content !== "die")
            await message.channel.send(dieMessage);

    }
};

export default command;