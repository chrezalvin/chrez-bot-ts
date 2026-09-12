import { InteractionReplyOptions, MessageCreateOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import { EnemyOrchestrator, ItemOrchestrator } from "@services/supabase/services/orchestrator";
import z from "zod";
import { enemySelect } from "./enemySelect";
import { enemyDetail } from "./enemyDetail";

export const enemySchema = z.object({
    name: z.string().min(2)
}).or(z.object({
    enemy: z.string(),
    area: z.string(),
    enemy_type: z.string(),
    level: z.coerce.number(),
}));

export type I_Enemy = z.input<typeof enemySchema>;

export async function enemy(args: I_Enemy): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = enemySchema.parse(args);

    if("name" in parsed){
        const enemies = await EnemyOrchestrator.getEnemies(parsed.name);

        return enemySelect(enemies);
    }
    else{
        const item = await EnemyOrchestrator.getEnemy(
            parsed.enemy,
            parsed.area,
            parsed.enemy_type,
            parsed.level
        );
    
        return enemyDetail(item);
    }
}