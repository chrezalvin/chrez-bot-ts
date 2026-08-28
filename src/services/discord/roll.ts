import { MyEmbedBuilder, rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const rollSchema = z.object({
    first: z.number(),
    second: z.number()
}).or(z.object({
    first: z.null(),
    second: z.null()
}));

export type I_Roll = z.input<typeof rollSchema>;

export async function roll(args: I_Roll): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = rollSchema.parse(args);

    const rng = rngInt(args.first ?? 1, args.second ?? 6);

    const embed = new MyEmbedBuilder();
    if(args.first === 1 && args.second === 6)
        embed
            .setTitle("rolls a die")
            .setDescription(`I rolled a die and got ${rng}`);
    else
        embed
            .setTitle(`rolls a number between ${args.first} and ${args.second}`)
            .setDescription(`I rolled a ${rng}!`);
        
    return {embeds: [embed]};
}