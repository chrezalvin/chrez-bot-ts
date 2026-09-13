import z from "zod";
import { 
    elementModel,
    elementWeaknessModel,
    enemyDetailModel,
    enemyDifficultyModel,
    enemyModel,
    enemyTypeModel,
    iconModel,
    locationAreaModel,
    locationModel,
    locationTypeModel
 } from "../../models";
import { itemEquipableLabelTypeModel, itemEquipableModel, itemEquipableTypeModel, itemModel } from "../../models/Items";

export const enemyView = enemyDetailModel.pick({
    level: true,
    base_exp: true,
    hp: true,
}).extend({
    enemy: enemyModel,
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
            }),
        })
    }),

    enemy_type: enemyTypeModel.pick({
        name: true,
    })
    .extend({
        icon: iconModel.nullable()
    }),

    element: elementModel
        .pick({})
        .extend({
            element: elementWeaknessModel
                .pick({})
                .extend({
                    element: elementModel,
                    weakness: elementModel
                }).array()
        })
        .transform(e => {
            return e.element[0];
        }),

    enemy_difficulty: enemyDifficultyModel.nullable(),

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