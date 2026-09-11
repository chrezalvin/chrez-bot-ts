import { InteractionReplyOptions, MessageCreateOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import { ItemOrchestrator } from "@services/supabase/services/orchestrator";
import z from "zod";
import { itemSelect } from "./itemSelect";
import { itemDetail } from "./itemDetail";

export const itemSchema = z.object({
    name: z.string().min(2)
}).or(z.object({
    itemId: z.string().min(2)
}));

export type I_Item = z.infer<typeof itemSchema>;

export async function item(args: I_Item): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = itemSchema.parse(args);

    let itemId: string | null = null;
    if("name" in parsed){
        const items = await ItemOrchestrator.getItems(parsed.name);

        if(items.length > 1)
            return itemSelect(items);

        itemId = items[0].item;
    }
    else
        itemId = parsed.itemId;

    const item = await ItemOrchestrator.getItem(itemId);

    return itemDetail(item);
}