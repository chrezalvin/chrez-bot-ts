import { MyEmbedBuilder } from "@library";
import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import emojis from "@assets/data/emojis.json";
import { EnemyView } from "@services/supabase/types/views/enemy";

export async function enemyDetail(enemy: EnemyView): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const embed = new MyEmbedBuilder();

    embed.setTitle(`${enemy.enemy.name} (Lv. ${enemy.level})`);
    embed.setDescription(`${enemy.area.location.name} - ${enemy.area.name}`);

    embed.addFields([{
        name: `Difficulty`,
        value: `${enemy.enemy_difficulty?.name}\n${enemy.enemy_difficulty?.description}`
    }])

    embed.addFields([{
        name: `HP`,
        value: `${enemy.hp}`,
        inline: true,
    }]);

    embed.addFields([{
        name: `${emojis["skill_overlimit"]} element`,
        value: `**${enemy.element.element.name}** weak to **${enemy.element.weakness.name}**`,
        inline: true,
    }]);

    embed.addFields([{
        name: `${emojis["stats_experience"]} Base EXP`,
        value: `${enemy.base_exp}`,
        inline: true,
    }]);

    embed.addFields([{
        name: `${emojis["item_chest_wood"]} Drops`,
        value: enemy.drops.map(drop => {
            let icon: string | undefined = undefined;

            if(drop.item_processable)
                icon = drop.item_processable.material.icon?.discord_emoji;

            if(drop.item_crysta)
                icon = drop.item_crysta.crysta_type.icon?.discord_emoji;

            if(drop.item_equipable)
                icon = drop.item_equipable.equipment_type.icon?.discord_emoji;

            return `${icon} ${drop.name}`;
        })
        .join("\n")
    }])

    const selectMenu = new StringSelectMenuBuilder();
    selectMenu
        .setPlaceholder(`Select from this box to search for item drop`)
        .setCustomId("item");
    
    for(const item of enemy.drops){
        let icon: string | undefined = undefined;
        let label: string | null = null;

        if(item.item_processable)
            icon = item.item_processable.material.icon?.discord_emoji;

        if(item.item_crysta)
            icon = item.item_crysta.crysta_type.icon?.discord_emoji;
        else if(item.item_equipable){
            icon = item.item_equipable.equipment_type.icon?.discord_emoji;

            if(item.item_equipable.label)
                label = item.item_equipable.label.name
        }

        const strSelect = new StringSelectMenuOptionBuilder();

        if(icon)
            strSelect.setEmoji(icon);
    
        if(label)
            strSelect.setDescription(label);

        strSelect
            .setValue(item.item)
            .setLabel(item.name);

        selectMenu.addOptions(strSelect);
    }

    const row = new ActionRowBuilder();
    row.addComponents(selectMenu)

    return {
        embeds: [embed], 
        components: [row as any]
    };
}