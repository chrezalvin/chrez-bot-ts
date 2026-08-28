import { MyEmbedBuilder } from "@library";
import { muted, setMute } from "@shared/isMute";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const unmuteSchema = z.object({

});

export type I_Unmute = z.input<typeof unmuteSchema>;

export function unmute(args: I_Unmute): MessageCreateOptions & InteractionReplyOptions{
    const embed = new MyEmbedBuilder();
    if(!muted)
        embed.setDescription(`Chrezbot is already unmuted`);
    else{
        setMute(false);
        embed.setTitle(`Chrezbot has been unmuted!`)
    }

    return { embeds: [embed] };
}