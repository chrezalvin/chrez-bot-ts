import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Icon } from "@services/supabase/types";
import { EnemySimpleView } from "@services/supabase/types/views/enemy";

export async function enemySelect(enemies: EnemySimpleView[]): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const stringComponent = new StringSelectMenuBuilder()
        .setCustomId('enemy')
        .setPlaceholder('Select enemy')

    for(const enemy of enemies){
        let icon: Icon | null = null;
        let label: string | null = null;
        let title: string = `${enemy.enemy_name} Lv. ${enemy.level}`;
        
        if(enemy.enemy_type_icon)
            icon = enemy.enemy_type_icon;
        
        if(enemy.difficulty_label)
            title += ` (${enemy.difficulty_label})`;

        if(enemy.area.length > 0)
            label = `${enemy.area[0].name} - ${enemy.area[0].location?.name}`;

        const strSelect = new StringSelectMenuOptionBuilder();

        if(icon)
            strSelect.setEmoji(icon.discord_emoji);
    
        if(label)
            strSelect.setDescription(label);

        strSelect
            .setValue(enemy.enemy)
            .setLabel(title);

        stringComponent.addOptions(strSelect);
    }
    
    const action = new ActionRowBuilder();
    action.addComponents(stringComponent);

    return {
        content: `found ${enemies.length} types of mob, please select from this box below:`,
        components: [action as any],
    };
}