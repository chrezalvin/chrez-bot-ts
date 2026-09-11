import z from "zod";

export const enemyDifficultyModel = z.object({
    enemy_difficulty: z.string(),
    name: z.string(),
    description: z.string(),
});

export type EnemyDifficulty = z.infer<typeof enemyDifficultyModel>;