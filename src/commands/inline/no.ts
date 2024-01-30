import {inlineCommandReturnTypes} from "library/customTypes";
import { MessageType } from "discord.js";
import { rngInt } from "@library/basicFunctions";

const nos = [
    ":(",
    "oh ok",
    "okay :(",
    "D:",
    "oh well",
    "oh",
    "I see",
    "I understand",
]

const command: inlineCommandReturnTypes = {
    name: "no",
    searchCriteria: [/^no$/i, /^i refuse$/i],
    description: "responds to user saying no to reply",
    execute: async (message) => {
        const no = nos[rngInt(0, nos.length - 1)];

        if(message.type === MessageType.Reply){
            const repliedMessage = await message.fetchReference();
            if(repliedMessage.author.id === message.client.user?.id)
                await repliedMessage.reply(no);
        }
    }
};

export default command;