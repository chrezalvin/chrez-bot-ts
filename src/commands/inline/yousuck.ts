import {InlineCommandReturnTypes, rngInt} from "@library";
import { MessageType } from "discord.js";
import yousuckData from "@assets/messages/inline/yousuck.json";

const command: InlineCommandReturnTypes = {
    name: "yousuck",
    searchCriteria: [/^you suck$/i],
    description: "sending message when chrezbot is being replied by a message that contains 'you suck'",
    execute: async (message) => {
        if(message.type === MessageType.Reply){
            const repliedMessage = await message.fetchReference();

            const yousuck = yousuckData[rngInt(0, yousuckData.length - 1)];
            if(repliedMessage.author.id === message.client.user?.id)
                await message.reply(yousuck);
        }

    }
};

export default command;