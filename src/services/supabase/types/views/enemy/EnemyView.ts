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
import { itemCrystaModel, itemEquipableLabelTypeModel, itemEquipableModel, itemEquipableTypeModel, itemMaterialTypeModel, itemModel, itemProcessableModel } from "../../models/Items";

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
            location_type: locationTypeModel.nullable()
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
        .extend({
            item_crysta: itemCrystaModel
                .pick({})
                .extend({
                    crysta_type: itemCrystaModel
                        .pick({})
                        .extend({
                            icon: iconModel.nullable()
                        })
                })
            .nullable(),

            item_processable: itemProcessableModel
                .pick({})
                .extend({
                    material: itemMaterialTypeModel
                        .pick({})
                        .extend({
                            icon: iconModel.nullable()
                        })
                })
            .nullable(),

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