import z from "zod";
import { itemEquipableLabelTypeModel, itemEquipableModel, itemEquipableTypeModel, itemModel } from "../../models/Items";
import { iconModel } from "../../models";

export const itemSimpleView = itemModel
    .pick({
        item: true,
        name: true,
        description: true,
        is_verified: true,
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
                }).nullable()
        })
        .nullable(),
});

export type ItemSimpleView = z.infer<typeof itemSimpleView>;