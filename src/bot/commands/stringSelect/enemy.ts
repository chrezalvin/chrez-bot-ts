import { StringSelectCommand } from "@bot/commands/types";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { EnemyService } from "@services/discord";

const customId = "enemy";

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const itemId = ctx.stringSelectMenuInteraction.values[0];
   
    const res = await EnemyService.enemy({
        enemy: itemId
    });

    await ctx.stringSelectMenuInteraction.reply(res);
}

export default {customId, middlewares: [execute]} as StringSelectCommand;