import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { foodBuffCode, myFoodBuffCode, setFoodBuffCode } from "@services/discord/FoodBuff";
import { SlashCommand } from "@commands/types";
import { SlashCommandBuilder } from "discord.js";

const slash = new SlashCommandBuilder()
        .setName("foodbuffcode")
        .setDescription("Search food buff code by name")
        .addStringOption(option => 
            option.setName("stat")
                .setDescription("Can be me / guild / a food buff type (ex: atk/mp/crit)")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("set")
                .setDescription("The stats of the codes you want to set, separate by comma (ex: \"atk, mp, crit\")")
                .setRequired(false)
        );

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const setArgs = ctx.chatInteraction.options.getString("set");
    const stat = ctx.chatInteraction.options.getString("stat")
    
    let embeds = undefined;

    if(stat){
        if(stat === "me")
            embeds = await myFoodBuffCode({
                user_id: ctx.chatInteraction.user.id
            });
        else
            embeds = await foodBuffCode({stat: stat}); 
    }

    if(setArgs){
        const sets = setArgs.split(",").map(stat => stat.trim());

        embeds = await setFoodBuffCode({
            user_id: ctx.chatInteraction.user.id,
            keywords: sets
        });
    }
    else
        throw new Error("Invalid command!");

    await ctx.chatInteraction.reply(embeds);
}

export default {slash, middlewares: [execute]} as SlashCommand;