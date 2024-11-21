import {inlineCommandReturnTypes, rngInt} from "@library";
import { MessageType } from "discord.js";
import thatsucksData from "@assets/messages/inline/thatsucks.json";

const command: inlineCommandReturnTypes = {
    name: "thatsucks",
    searchCriteria: [/^that sucks$/i, /^that's sucks$/i, /^sucks$/i],
    description: "sending message when chrezbot is being replied by a message that contains 'you suck'",
    execute: async (message) => {
        if(message.type === MessageType.Reply){
            const repliedMessage = await message.fetchReference();

            const thatsucks = thatsucksData[rngInt(0, thatsucksData.length - 1)];
            if(repliedMessage.author.id === message.client.user?.id)
                await message.reply(thatsucks);
        }

    }
};

export default command;