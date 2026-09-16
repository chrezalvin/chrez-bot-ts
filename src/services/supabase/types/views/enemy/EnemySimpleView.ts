import z from "zod";
import { 
    enemyModel,
    enemyTypeModel,
    iconModel,
    locationAreaModel,
    locationModel
 } from "../../models";
import { enemyNameModel } from "../../models/Enemies/EnemyName";

export const enemySimpleView = enemyModel.pick({
    enemy: true,
    level: true,
    difficulty_label: true,
    variant_label: true,
}).extend({
    enemy_name: enemyNameModel.shape.name,
    enemy_type_icon: iconModel.nullable(),

    area: locationAreaModel.pick({
            area: true,
            name: true,
        })
        .extend({
            location: locationModel.nullable()
        }).array()
})

export type EnemySimpleView = z.infer<typeof enemySimpleView>;