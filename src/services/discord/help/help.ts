import { BOT_PREFIXES } from "@config";
import { MyEmbedBuilder } from "@library";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const helpSchema = z.object({
    chatCommands: z.array(z.custom<ChatCommandBuilder>())
});

export type I_Help = z.infer<typeof helpSchema>;

export async function help(args: I_Help): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = helpSchema.parse(args);

    const embed = new MyEmbedBuilder();
    embed.setTitle("Chrez-bot help menu")
        .setDescription("here are the list of commands that chrezbot can use")

    const commands = parsed.chatCommands;
    for(const command of commands)
        embed.addFields({
            name: `\`${BOT_PREFIXES[0]} ${command.name}\``, 
            value: command.description,
            inline: true
        });

    return {embeds: [embed]};
}