import {inlineCommandReturnTypes, rngInt} from "@library";
import itsokays from "@assets/messages/inline/itsokay.json";
import { MessageType } from "discord.js";
import { CLIENT_ID } from "@config";

const command: inlineCommandReturnTypes = {
    name: "itsok",
    description: "Says random message whenever user reply chrezbot with sorry",
    searchCriteria: [/sorry/gi],
    acceptedLength: 10,
    execute: async (message) => {
        // will be removed as soon acceptable length is implemented
        if(message.content.length > 10) return;

        // check if reply
        if(message.type !== MessageType.Reply) return;

        const messageReplied = await message.fetchReference();
        if(
            messageReplied.author.bot 
            && 
            messageReplied.author.id === CLIENT_ID 
            && 
            messageReplied.content.match(/yell/i)
            &&
            messageReplied.createdAt.getTime() > Date.now() - 1000 * 60 * 5
        ){
            message.reply({
                allowedMentions: { repliedUser: false },
                content: itsokays[rngInt(0, itsokays.length - 1)],
            });
        }
    },
};

export default command;