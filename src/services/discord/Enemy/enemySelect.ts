import { ContainerBuilder, InteractionReplyOptions, MessageCreateOptions, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import { Icon } from "@services/supabase/types";
import { EnemySimpleView } from "@services/supabase/types/views/enemy";

export async function enemySelect(enemies: EnemySimpleView[]): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const action = new ContainerBuilder();
    action.addTextDisplayComponents(textDisplay => {
        return textDisplay.setContent(`found ${enemies.length} types of mob, please select from this box below:`)
    })

    action.addActionRowComponents(action => {
        const stringComponent = new StringSelectMenuBuilder()
            .setCustomId('enemy')
            .setPlaceholder('Select enemy')

        for(const enemy of enemies){
            for(const enemyDetail of enemy.enemy_detail){
                let icon: Icon | null = null;
                let label: string | null = null;
                let title: string = enemy.name;
                
                if(enemyDetail.enemy_type.icon)
                    icon = enemyDetail.enemy_type.icon;

                if(enemyDetail.level)
                    title += ` Lv. ${enemyDetail.level}`;

                if(enemyDetail.enemy_difficulty)
                    title += ` (${enemyDetail.enemy_difficulty.name})`;

                if(enemyDetail.area)
                    label = `${enemyDetail.area.name} - ${enemyDetail.area.location.name}`
    
                const strSelect = new StringSelectMenuOptionBuilder();
    
                if(icon)
                    strSelect.setEmoji(icon.discord_emoji);
            
                if(label)
                    strSelect.setDescription(label);
    
                strSelect
                    .setValue(`${enemyDetail.enemy.enemy} ${enemyDetail.area.area} ${enemyDetail.enemy_type.enemy_type} ${enemyDetail.level}`)
                    .setLabel(title);
    
                stringComponent.addOptions(strSelect);
            }
        }

        action.addComponents(stringComponent);

        return action;
    })

    return {
        components: [action],
        flags: MessageFlags.IsComponentsV2
    };
}