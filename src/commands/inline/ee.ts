import {InlineCommandReturnTypes, rngInt} from "@library";
import { MessageType } from "discord.js";
import eeData from "@assets/messages/inline/ee.json";

const command: InlineCommandReturnTypes = {
    name: "e.e",
    searchCriteria: ["e.e"],
    description: "sending message to replied e.e message",
    execute: async (message) => {
        if(message.type === MessageType.Reply){
            const repliedMessage = await message.fetchReference();

            const ee = eeData[rngInt(0, eeData.length - 1)];
            if(repliedMessage.author.id === message.client.user?.id)
                await message.reply(ee);
        }

    }
};

export default command;