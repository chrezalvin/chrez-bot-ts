import { StringSelectCommand } from "@bot/commands/types";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { EnemyService } from "@services/discord";

const customId = "enemy";

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const itemId = ctx.stringSelectMenuInteraction.values[0];

    const args = itemId.split(" ");
    console.log(args);
   
    const res = await EnemyService.enemy({
        enemy: args[0],
        area: args[1],
        enemy_type: args[2],
        level: args[3],
    });

    await ctx.stringSelectMenuInteraction.reply(res);
}

export default {customId, middlewares: [execute]} as StringSelectCommand;