const debug = require("debug")("ChrezBot:update");

import {MyEmbedBuilder, CommandBuilder, ErrorValidation, rngInt} from "@library";

import { MessageType } from "discord.js";
import { BOT_PREFIXES } from "@config";
import translates from "@assets/messages/active/translate.json";

function getConotationMessage(positive: number, negative: number, neutral: number): string{
    // if all are 0 except positive
    if(positive > 0 && negative === 0 && neutral === 0)
        return "I think they meant well";

    // if all are 0 except negative
    if(negative > 0 && positive === 0 && neutral === 0)
        return "It's a negative message";

    // if all are 0 except neutral
    if(neutral > 0 && positive === 0 && negative === 0)
        return "It's not really a good or bad message, they just said something";

    // if neutral is 0 but positive is greater than negative
    if(neutral === 0 && positive > negative)
        return "It's mixed, but I think they meant well";

    // if neutral is 0 but negative is greater than positive
    if(neutral === 0 && negative > positive)
        return "It's mixed, but I think it's a bad message";

    // if positive is 0 but negative is greater than neutral
    if(positive === 0 && negative > neutral)
        return "It's some bad message";

    // if positive is 0 but neutral is greater than negative
    if(positive === 0 && neutral > negative)
        return "They just saying something, but may be bad";

    // if negative is 0 but positive is greater than neutral
    if(negative === 0 && positive > neutral)
        return "It's some good message";

    // if negative is 0 but neutral is greater than positive
    if(negative === 0 && neutral > positive)
        return "the message is good";

    if(positive > negative)
        return "It's a mostly positive message";

    if(negative > positive)
        return "It's a mostly negative message";

    return "";
}

type Conotation = "positive" | "negative" | "neutral";
const run = async (translateParams: I_Translate) => {
    debug(`translating message: ${translateParams.message}`);

    const message = translateParams.message.toLowerCase();

    let countConotations: {[key in Conotation]: number} = {
        positive: 0,
        negative: 0,
        neutral: 0
    };
    const contents: {name: string, description: string}[] = []; 
    for(const translate of translates.translations){
        if(Array.isArray(translate.name))
            for(const name of translate.name){
                if(message.match(`((\\s|\\+)${name}(\\s|\\+))|(^${name}(\\s|\\+))|((\\s|\\+)${name}$)`)){
                    countConotations[translate.conotation as Conotation] += 1;                    
                    contents.push({
                        // remove symbols from the name
                        name: name.replace(/[^a-zA-Z0-9]/g, ""),
                        description: translate.explanations[rngInt(0, translate.explanations.length - 1)]
                    });
                }
            }
        else
            if(message.match(`((\\s|\\+)${translate.name}(\\s|\\+))|(^${translate.name}(\\s|\\+))|((\\s|\\+)${translate.name}$)`)){
                countConotations[translate.conotation as Conotation] += 1;
                contents.push({
                    name: translate.name.replace(/[^a-zA-Z0-9]/g, ""), 
                    description: translate.explanations[rngInt(0, translate.explanations.length - 1)]
                });
            }
    }

    if(contents.length === 0)
        return {
            content: translates.noTranslates[rngInt(0, translates.noTranslates.length - 1)]
        };

    const conotationMessage = getConotationMessage(countConotations.positive, countConotations.negative, countConotations.neutral);
    const embed = new MyEmbedBuilder();

    embed.setTitle("Translation")
    embed.setDescription(contents.map(content => `\`${content.name}\`: ${content.description}`).join("\n"));
    if(conotationMessage !== "")
        embed.setFooter({text: conotationMessage});
    return {content: translates.sendMessage[rngInt(0, translates.sendMessage.length - 1)], embeds: [embed]};
} 

interface I_Translate{
    message: string;
}

const update = new CommandBuilder<I_Translate>()
    .setName("translate")
    .setAlias(["explain", "define", "meaning", "slang"])
    .setDescription("Gives you translation of slangs")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} update`, description: "give latest update"},
        {command: `${BOT_PREFIXES[0]} update 1.1.0`, description: "give update 1.1.0"}
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