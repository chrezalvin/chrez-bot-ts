import { InteractionReplyOptions, MessageCreateOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import { EnemyOrchestrator, ItemOrchestrator } from "@services/supabase/services/orchestrator";
import z from "zod";
import { enemySelect } from "./enemySelect";
import { enemyDetail } from "./enemyDetail";

export const enemySchema = z.object({
    name: z.string().min(2)
}).or(z.object({
    enemy: z.string(),
}));

export type I_Enemy = z.input<typeof enemySchema>;

export async function enemy(args: I_Enemy): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = enemySchema.parse(args);

    if("name" in parsed){
        const enemies = await EnemyOrchestrator.getEnemies(parsed.name);

        return enemySelect(enemies);
    }
    else{
        const item = await EnemyOrchestrator.getEnemy(parsed.enemy);
    
        return enemyDetail(item);
    }
}