import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { SlashCommandBuilder } from "discord.js";
import updates from "@assets/messages/active/update.json";
import { update } from "@services/discord/update";
import { SlashCommand } from "@commands/types";

const slash = new SlashCommandBuilder()
        .setName("update")
        .setDescription("Gives you update about ChrezBot (news and bugfixes)")
        .addStringOption(opt => {
            for(const update of updates)
                opt.addChoices({name: `v${update.version}`, value: update.version})

            opt.setName("version");
            opt.setDescription("Version to specify");

            return opt;
        });

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const version = ctx.chatInteraction.options.getString("version", false);
    const embeds = await update({version: version ?? undefined });

    await ctx.chatInteraction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;