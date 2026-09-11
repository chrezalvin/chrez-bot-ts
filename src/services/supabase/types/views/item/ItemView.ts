import z from "zod";
import { 
    itemChestModel,
    itemCrystaModel,
    itemCrystaTypeModel, 
    itemCrystaUpgradeModel, 
    itemEquipableArmorModel, 
    itemEquipableTypeModel, 
    itemEquipableWeaponModel, 
    itemMaterialTypeModel, 
    itemModel, 
    itemOreModel, 
    itemProcessableModel, 
    itemSellableModel,
    itemStatModel,
    itemToolModel
} from "../../models/Items";
import { enemyDifficultyModel, enemyModel, enemyTypeModel, iconModel, locationAreaModel, locationModel, locationTypeModel, statModel } from "../../models";
import { statRestrictionModel } from "../../models/Stats/StatRestriction";

const crystaUpgrades = itemCrystaUpgradeModel
    .pick({})
    .extend({
        base_crysta: itemCrystaModel
            .pick({})
            .extend({
                item: itemModel.pick({
                    name: true
                }),
                crysta_type: itemCrystaTypeModel
                    .pick({})
                    .extend({
                        icon: iconModel.nullable(),
                        icon_highlighted: iconModel.nullable(),
                    })
            }),
        item_crystas: itemCrystaModel
            .pick({})
            .extend({
                upgrades: itemCrystaUpgradeModel
                    .pick({})
                    .extend({
                        crysta: itemCrystaModel
                            .pick({})
                            .extend({
                                item: itemModel
                                    .pick({
                                        name: true
                                    }),
                                crysta_type: itemCrystaTypeModel
                                    .pick({})
                                    .extend({
                                        icon: iconModel,
                                        icon_highlighted: iconModel.nullable(),
                                    })
                            }),
                        upgrade_for: itemCrystaModel
                            .pick({})
                            .extend({
                                item: itemModel
                                    .pick({
                                        name: true
                                    }),
                                crysta_type: itemCrystaTypeModel
                                    .pick({})
                                    .extend({
                                        icon: iconModel,
                                        icon_highlighted: iconModel.nullable(),
                                    })
                            })
                    })
                    .array()
            })
    }).array();

export const itemView = itemModel.extend({
    item_crysta: z.object({
        crysta_type: itemCrystaTypeModel.pick({
            name: true
        })
        .extend({
            icon: iconModel.nullable(),
            icon_highlighted: iconModel.nullable(),
        }),
        upgrades_from_for: crystaUpgrades,
        upgrades_from_base: crystaUpgrades,
    })
    .transform(arr => {
        let upgrades: typeof arr.upgrades_from_base = [];

        if(arr.upgrades_from_base.length > 0)
            upgrades = arr.upgrades_from_base;
        else if(arr.upgrades_from_for.length > 0)
            upgrades = arr.upgrades_from_for;

        return {
            ...arr,
            upgrades: upgrades.map(ele => ({
                base_crysta: ele.base_crysta,
                upgrades: ele.item_crystas.upgrades
            }))
        }
    })
    .nullable(),
    
    item_sellable: itemSellableModel.pick({
        sell: true,
    })
    .nullable(),
    
    item_tool: itemToolModel.pick({
        max_stack: true, 
        duration_minute: true,
    })
    .nullable(),
    
    item_ore: itemOreModel.pick({
        refine_point: true,
    })
    .nullable(),
    
    item_processable: itemProcessableModel.pick({
        process_point: true,
    }).extend({
        material: itemMaterialTypeModel.pick({
            name: true
        }).extend({
            icon: iconModel.nullable()
        })
    })
    .nullable(),

    item_equipable: z.object({
        item_equipable_type: itemEquipableTypeModel.pick({
            name: true
        }).extend({
            icon: iconModel.nullable(),
        }),
        armor: itemEquipableArmorModel.pick({
            base_def: true
        })
        .nullable(),
        weapon: itemEquipableWeaponModel.pick({
            base_atk: true,
            base_stability: true
        })
        .nullable()
    })
    .nullable(),

    item_stats: itemStatModel.pick({
        amount: true,
    }).extend({
        restriction: statRestrictionModel,
        stat: statModel.pick({
            stat_name: true,
            stat_markdown: true,
            order: true
        }).extend({
            icon: iconModel.nullable()
        })
    })
    .array()
    .transform(arr => {
        arr = arr.sort((a, b) => a.stat.order - b.stat.order);
        const records: Record<string, typeof arr> = {};

        for(const ele of arr)
            records[ele.restriction.stat_restriction] = [...(records[ele.restriction.stat_restriction] ?? []), ele];

        return records;
    }),

    item_chests: itemChestModel.nullable(),

    enemy: z.object({
        enemy: enemyModel.pick({
            name: true
        }),
        area: locationAreaModel.pick({
            name: true,
        }).extend({
            location: locationModel.pick({
                name: true,
            }).extend({
                location_type: locationTypeModel.pick({
                    name: true
                }).extend({
                    icon: iconModel.nullable()
                })
            })
        }),
        enemy_type: enemyTypeModel.pick({
            name: true
        }).extend({
            icon: iconModel.nullable()
        }),
        difficulty: enemyDifficultyModel.pick({
            name: true
        })
        .nullable()
    }).array()
})

export type ItemView = z.infer<typeof itemView>;