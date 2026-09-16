import z from "zod";
import { 
    elementModel,
    elementWeaknessModel,
    enemyModel,
    enemyTypeModel,
    iconModel,
    locationAreaModel,
    locationModel,
    locationTypeModel
 } from "../../models";
import { itemEquipableLabelTypeModel, itemEquipableModel, itemEquipableTypeModel, itemModel } from "../../models/Items";
import { enemyNameModel } from "../../models/Enemies/EnemyName";
import { enemyBossModel } from "../../models/Enemies/EnemyBoss";

export const enemyView = enemyModel.pick({
    level: true,
    base_exp: true,
    hp: true,
    difficulty_label: true,
    variant_label: true,
}).extend({
    enemy_name: enemyNameModel.shape.name,
    element: elementModel.shape.name,

    enemy_boss: enemyBossModel.pick({
        has_difficulty: true
    })
    .nullable(),

    area: locationAreaModel.pick({
        name: true,
    })
    .extend({
        location: locationModel.pick({
            name: true,
        })
        .extend({
            location_type: locationTypeModel.pick({
                name: true,
            })
            .extend({
                icon: iconModel.nullable()
            })
            .nullable(),
        })
    })
    .array(),

    enemy_type: enemyTypeModel.pick({
        name: true,
    })
    .extend({
        icon: iconModel.nullable()
    }),

    drops: itemModel
        .pick({
            description: true,
            is_verified: true,
            item: true,
            name: true,
        })
        .extend({
            icon: iconModel.nullable(),

            item_equipable: itemEquipableModel
                .pick({})
                .extend({
                    equipment_type: itemEquipableTypeModel
                        .pick({
                            name: true
                        })
                        .extend({
                            icon: iconModel.nullable()
                        }),
                    label: itemEquipableLabelTypeModel
                        .pick({
                            name: true,
                        })
                        .extend({
                            icon: iconModel.nullable()
                        })
                        .nullable()
                })
            .nullable()
        }).array()
})

export type EnemyView = z.infer<typeof enemyView>;