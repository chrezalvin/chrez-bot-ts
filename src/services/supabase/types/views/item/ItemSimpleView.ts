import z from "zod";
import { itemChestModel, itemCrystaModel, itemCrystaTypeModel, itemEquipableLabelTypeModel, itemEquipableModel, itemEquipableTypeModel, itemMaterialTypeModel, itemModel, itemProcessableModel } from "../../models/Items";
import { iconModel } from "../../models";

export const itemSimpleView = itemModel.extend({
    item_crysta: itemCrystaModel
        .pick({})
        .extend({
            crysta_type: itemCrystaTypeModel
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
                    icon: iconModel
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
                }).nullable()
        })
        .nullable(),

    item_chests: itemChestModel.nullable()
});

export type ItemSimpleView = z.infer<typeof itemSimpleView>;