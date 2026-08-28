import { MyEmbedBuilder } from "@library";
import { absoluteMuted, setAbsoluteMute } from "@shared/isAbsoluteMuted";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const absoluteMuteSchema = z.object({
    absolutemute: z.boolean().optional().default(true)
});

export type I_AbsoluteMute = z.infer<typeof absoluteMuteSchema>;

export function absoluteMute(args: I_AbsoluteMute): MessageCreateOptions & InteractionReplyOptions{
    const {absolutemute} = absoluteMuteSchema.parse(args);

    const embed = new MyEmbedBuilder();
    if(absolutemute == absoluteMuted)
        embed.setDescription(`Chrezbot is already ${absoluteMuted ? "Absolutely Muted": "Unmuted"}`);
    else{
        setAbsoluteMute(absolutemute)
        embed.setTitle(`Chrezbot has been ${absolutemute? "Absolutely Muted": "Unmuted"}!`)
        if(absolutemute)
            embed.setDescription("All commands have been disabled until the owner unmute the bot");
    }

    return {
        embeds: [embed]
    };
}