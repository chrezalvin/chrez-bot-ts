const debug = require("debug")("ChrezBot:yomama");

import { MyEmbedBuilder, rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";
import yomamas from "@assets/messages/active/yomama.json";

export const yomamaSchema = z.object({
    index: z.number().min(1).max(yomamas.length).default(() => rngInt(0, yomama.length - 1))
});

export type I_Yomama = z.input<typeof yomamaSchema>;

export async function yomama(args: I_Yomama): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = yomamaSchema.parse(args);
    
    const embed = new MyEmbedBuilder();
    const yomama = yomamas[parsed.index];

    embed.setDescription(yomama)
            .setTitle(`Yomama #${parsed.index}`);

    return {embeds: [embed]};
}