import z from "zod";
import { 
    enemyDetailModel,
    enemyDifficultyModel,
    enemyModel,
    enemyTypeModel,
    iconModel,
    locationAreaModel,
    locationModel
 } from "../../models";

export const enemySimpleView = enemyModel.pick({
    name: true,
}).extend({
    enemy_detail: enemyDetailModel.pick({
        level: true
    }).extend({        
        enemy: enemyModel,
        area: locationAreaModel.pick({
            name: true,
            area: true,
        })
        .extend({
            location: locationModel
        }),
    
        enemy_type: enemyTypeModel.pick({
            name: true,
            enemy_type: true,
        })
        .extend({
            icon: iconModel.nullable()
        }),
    
        enemy_difficulty: enemyDifficultyModel.pick({
            name: true
        })
        .nullable()
    }).array()
})

export type EnemySimpleView = z.infer<typeof enemySimpleView>;