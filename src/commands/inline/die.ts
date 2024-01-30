import {inlineCommandReturnTypes} from "library/customTypes";
import { MessageType } from "discord.js";

import dieMessages from "@assets/messages/inline/die.json";
import { rngInt } from "@library/basicFunctions";
import { ownerID } from "@config";

const command: inlineCommandReturnTypes = {
    name: "die",
    searchCriteria: [/chrez die|die cheese/i, /^die$/i],
    description: "Do random stuff (including deleting people >:D)",
    execute: async (message) => {
        let dieMessage: string  = "";

        if(message.author.id === ownerID)
            dieMessage = dieMessages.owner[rngInt(0, dieMessages.owner.length - 1)];
        else
            dieMessage = dieMessages.normal[rngInt(0, dieMessages.normal.length - 1)].replace("[name]", message.author.username);

        if(message.type === MessageType.Reply){
            const repliedMessage = await message.fetchReference();
            await repliedMessage.reply(dieMessage);
        }
        else if(message.content !== "die")
            await message.channel.send(dieMessage);

    }
};

export default command;