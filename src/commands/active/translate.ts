const debug = require("debug")("ChrezBot:update");

import {MyEmbedBuilder, CommandBuilder, ErrorValidation, rngInt} from "@library";

import { MessageType } from "discord.js";
import { prefixes } from "@config";
import translates from "@assets/messages/active/translate.json";

const run = async (translateParams: I_Translate) => {
    debug(`translating message: ${translateParams.message}`);

    const message = translateParams.message.toLowerCase();

    const contents: {name: string, description: string}[] = []; 
    for(const translate of translates.translations){
        if(Array.isArray(translate.name))
            for(const name of translate.name){
                if(message.match(`(\\s${name}\\s)|(^${name}\\s)|(\\s${name}$)`))
                    contents.push({
                        // remove symbols from the name
                        name: name.replace(/[^a-zA-Z0-9]/g, ""),
                        description: translate.explanations[rngInt(0, translate.explanations.length - 1)]
                    });
            }
        else
            if(message.match(`(\\s${translate.name}\\s)|(^${translate.name}\\s)|(\\s${translate.name}$)`))
                contents.push({
                    name: translate.name.replace(/[^a-zA-Z0-9]/g, ""), 
                    description: translate.explanations[rngInt(0, translate.explanations.length - 1)]
                });
    }

    if(contents.length === 0)
        return {
            content: translates.noTranslates[rngInt(0, translates.noTranslates.length - 1)]
        };

    const embed = new MyEmbedBuilder();

    embed.setTitle("Translation")
    embed.setDescription(contents.map(content => `\`${content.name}\`: ${content.description}`).join("\n"));
    
    return {content: translates.sendMessage[rngInt(0, translates.sendMessage.length - 1)], embeds: [embed]};
} 

interface I_Translate{
    message: string;
}

const update = new CommandBuilder<I_Translate>()
    .setName("translate")
    .setAlias(["explain", "define", "meaning"])
    .setDescription("Gives you translation of slangs")
    .setExamples([
        {command: `${prefixes[0]} update`, description: "give latest update"},
        {command: `${prefixes[0]} update 1.1.0`, description: "give update 1.1.0"}
    ])
    .setChat({
        execute: async (message) => {
            let content: string = "";

            // if the message is referencing another message (is replying to someone) get the message being replied to
            if(message.type === MessageType.Reply){
                const repliedMessage = await message.fetchReference();
        
                content = repliedMessage.content;
            }
            // if it doesn't replying anyone, get the last message before the user's message
            else{
                const messages = await message.channel.messages.fetch({limit: 2});
                const messageBefore = messages.last();
        
                if(!messageBefore)
                    return new ErrorValidation("message_error");
        
                content = messageBefore.content;
            }

            const res = await run({
                message: content
            });

            message.channel.send(res);
        },
    })

export default update;