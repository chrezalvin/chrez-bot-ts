import { ContainerBuilder, InteractionReplyOptions, MessageCreateOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import { ItemSimpleView } from "@services/supabase/types/views/item";

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

        action.addComponents(stringComponent);

        return action;
    })

    return {
        components: [action],
        flags: MessageFlags.IsComponentsV2
    };
}