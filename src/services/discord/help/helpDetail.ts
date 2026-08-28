import { BOT_PREFIXES } from "@config";
import { MyEmbedBuilder } from "@library";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const helpDetailSchema = z.object({
    chatCommand: z.custom<ChatCommandBuilder>()
});

export type I_HelpDetail = z.infer<typeof helpDetailSchema>;

export async function helpDetail(args: I_HelpDetail): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = helpDetailSchema.parse(args);
    const command = parsed.chatCommand;

    const embed = new MyEmbedBuilder();

    embed.setTitle(`${BOT_PREFIXES[0]} ${command.name}`)
        .setDescription(command.description);

    if(command.examples && command.examples.length > 0){
        embed.addFields({name: "Examples", value: "\u200B"});
        embed.addFields(command.examples.map(example => { return {name: example.command, value: example.description ?? "\u200B", inline: true}}));
    }

    if(command.alias && command.alias.length > 0)
        embed.setFooter({text: `possible alias for this command: ${command.alias.map(al => `\`${BOT_PREFIXES[0]} ${al}\``).join(", ")}`})
        
    embed.addFields({
        name: `\`${BOT_PREFIXES[0]} ${command.name}\``, 
        value: command.description,
        inline: true
    });

    return {embeds: [embed]};
}