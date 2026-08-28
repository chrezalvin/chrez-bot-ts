import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { event, I_Event, monthAliases } from "@services/discord/event";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
        .setName("event")
        .setDescription("give list of event with the given month")
        .addStringOption(option => {
            option.setName("month")
                .setDescription("month to search")
                .setRequired(false);
            
            for(const month of monthAliases){
                option.addChoices({
                    name: month.monthname,
                    value: month.monthname
                })
            }
            return option;
        })
        .addStringOption(option => option
            .setName("tag")
            .setDescription("(optional) tag for ongoing event or incoming event")
            .setRequired(false)
            .setChoices([
                {
                    name: "ongoing",
                    value: "Ongoing"
                },
                {
                    name: "incoming",
                    value: "Incoming"
                }
            ])
        )
        .addStringOption(option => option
            .setName("title")
            .setDescription("title of the event")
            .setRequired(false)
        );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const month = ctx.interaction.options.getString("month", false);
    const title = ctx.interaction.options.getString("title", false);
    let tag = (ctx.interaction.options.getString("tag", false) ?? "annual") as I_Event["tag"];

    const embeds = await event({
        tag,
        str: month || title || ""
    });

    await ctx.interaction.editReply({embeds: embeds.embeds});
}

export default {slash, middlewares: [execute]} as SlashCommand;