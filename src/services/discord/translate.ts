const debug = require("debug")("ChrezBot:translate");

import { MyEmbedBuilder, rngInt, Score } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import translates from "@assets/messages/active/translate.json";
import z from "zod";

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

export const translateSchema = z.object({
    message: z.string(),
});

type Conotation = "positive" | "negative" | "neutral";
export type I_Translate = z.infer<typeof translateSchema>;

export async function translate(args: I_Translate): Promise<MessageCreateOptions & InteractionReplyOptions>{
    debug(`translating message: ${args.message}`);

    const message = args.message.toLowerCase();

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