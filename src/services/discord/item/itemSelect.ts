import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { ItemSimpleView } from "@services/supabase/types/views/item";

export async function itemSelect(items: ItemSimpleView[]): Promise<MessageCreateOptions & InteractionReplyOptions>{    
    const stringComponent = new StringSelectMenuBuilder()
        .setCustomId('item')
        .setPlaceholder('Select item')

    for(const item of items){
        let label: string | null = null;

        if(item.item_equipable){
            if(item.item_equipable.label)
                label = item.item_equipable.label.name
        }

        const strSelect = new StringSelectMenuOptionBuilder();

        if(item.icon)
            strSelect.setEmoji(item.icon.discord_emoji);
    
        if(label)
            strSelect.setDescription(label);

        strSelect
            .setValue(item.item)
            .setLabel(item.name);

        stringComponent.addOptions(strSelect);
    }
    
    const action = new ActionRowBuilder();
    action.addComponents(stringComponent);

    return {
        content: `found ${items.length} items, please select from this box below:`,
        components: [action as any],
    };
}