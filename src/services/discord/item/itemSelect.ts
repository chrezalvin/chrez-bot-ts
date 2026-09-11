import { ContainerBuilder, InteractionReplyOptions, MessageCreateOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import { ItemSimpleView } from "@services/supabase/types/views/item";
import { Icon } from "@services/supabase/types";

export async function itemSelect(items: ItemSimpleView[]): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const action = new ContainerBuilder();
    action.addTextDisplayComponents(textDisplay => {
        return textDisplay.setContent(`found ${items.length} items, please select from this box below:`)
    })

    action.addActionRowComponents(action => {
        const stringComponent = new StringSelectMenuBuilder()
            .setCustomId('item')
            .setPlaceholder('Select item')

        for(const item of items){
            let icon: Icon | null = null;
            let label: string | null = null;

            if(item.item_processable)
                icon = item.item_processable.material.icon;

            if(item.item_crysta)
                icon = item.item_crysta.crysta_type.icon;
            else if(item.item_equipable){
                icon = item.item_equipable.equipment_type.icon;

                if(item.item_equipable.label)
                    label = item.item_equipable.label.name
            }

            const strSelect = new StringSelectMenuOptionBuilder();

            if(icon)
                strSelect.setEmoji(icon.discord_emoji);
        
            if(label)
                strSelect.setDescription(label);

            strSelect
                .setValue(item.item)
                .setLabel(item.name);

            stringComponent.addOptions(strSelect);
        }

        action.addComponents(stringComponent);

        return action;
    })

    return {
        components: [action],
        flags: MessageFlags.IsComponentsV2
    };
}