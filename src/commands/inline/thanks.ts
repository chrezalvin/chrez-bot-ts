import { CLIENT_ID } from "@config";
import {inlineCommandReturnTypes} from "@library";
import { MessageType } from "discord.js";
import thanks from "@assets/messages/inline/thanks.json";
import { rngArray } from "@library/BasicFunctions";

const command: inlineCommandReturnTypes = {
    name: "thanks",
    description: "reply to thanks messages",
    searchCriteria: [/(thanks?|ty)/],
    execute: async (message) => {
        // make sure the message is being replied to chrezbot
        if(message.type !== MessageType.Reply)
            return;

        const messageReplied = await message.fetchReference();
        if(messageReplied.author.id !== CLIENT_ID)
            return;

        // send reply
        const messageContent = message.content.toLowerCase();
        if(messageContent.includes("e.e"))
            message.reply(rngArray(thanks.sarcasm)!!);
        else
            message.reply(rngArray(thanks.genuine)!!);
    },
};

export default command;