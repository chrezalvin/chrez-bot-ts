import { MyEmbedBuilder } from "@library";
import { muted, setMute as sharedSetMute } from "@shared/isMute";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const setMuteSchema = z.object({
    mute: z.boolean().default(true)
});

export type I_SetMute = z.input<typeof setMuteSchema>;

export function setMute(args: I_SetMute, onUnmuted?: () => void): MessageCreateOptions & InteractionReplyOptions{
    const parsed = setMuteSchema.parse(args);
    
    const embed = new MyEmbedBuilder();
    if(parsed.mute == muted)
        embed.setDescription(`Chrezbot is already ${muted ? "muted": "unmuted"}`);
    else{
        sharedSetMute(parsed.mute, parsed.mute ? onUnmuted : undefined);

        embed.setTitle(`Chrezbot has been ${parsed.mute ? "muted": "unmuted"}!`)
        if(parsed.mute)
            embed.setDescription("Inline command have been muted for 10 minutes");
    }

    return {embeds: [embed]};
}