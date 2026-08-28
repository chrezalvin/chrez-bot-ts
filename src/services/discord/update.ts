const debug = require("debug")("ChrezBot:update");

import { MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";
import { BOT_VERSION } from "@config";
import { UpdateViewService } from "@services/supabase/services";

export const updateSchema = z.object({
    version: z.string().default(() => BOT_VERSION)
});

export type I_Update = z.input<typeof updateSchema>;

export async function update(args: I_Update): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = updateSchema.parse(args);

    debug(`getting update for version ${parsed.version}`);

    const update = await UpdateViewService.getUpdate(parsed.version);
    const embed = new MyEmbedBuilder();

    embed.setTitle(`Chrezbot \`v${update.version}\` news and bugfixes`)
    if(update.news)
        embed.addFields({
            name: "news",
            value: update.news.join("\n")
        });

    if(update.bugfix)
        embed.addFields({
            name: "bugfixes",
            value: update.bugfix.join("\n")
        });

    return {embeds: [embed]};
}