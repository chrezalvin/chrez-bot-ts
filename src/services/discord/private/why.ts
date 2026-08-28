import { MyEmbedBuilder, rngInt } from "@library";
import { DiscordUserViewService } from "@services/supabase/services";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";
import whys from "@assets/messages/private/why.json";

export const whySchema = z.object({
    discordId: z.string()
});

export type I_Why = z.input<typeof whySchema>;

export async function why(args: I_Why): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = whySchema.parse(args);

    const user = await DiscordUserViewService.getDiscordUser(parsed.discordId);

    if(!user)
        throw new Error("discord user not found!");

    const pickWhy = user.role == "user" ? "normal": "exclusive";

    const why = whys[pickWhy][rngInt(0, whys[pickWhy].length - 1)];

    const embed = new MyEmbedBuilder({
        title: why.title,
        description: why
            .description
            .replace("[name]", user.username)
            .replace("[role]", user.role ?? "user"),
        footer: {text: why.footer}
    });

    return {embeds: [embed]};
}