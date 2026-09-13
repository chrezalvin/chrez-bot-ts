import { MyEmbedBuilder } from "@library";
import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import emojis from "@assets/data/emojis.json";
import { EnemyView } from "@services/supabase/types/views/enemy";
import { middlewareEngine } from "@library/middlewareEngine";

interface EnemyViewMiddleware{
    embed: MyEmbedBuilder;
    enemy: EnemyView;
}

async function handleTitle({embed, enemy}: EnemyViewMiddleware, next: () => void){
    let name = enemy.enemy.name;
    let level = enemy.level;
    let difficulty = enemy.enemy_difficulty?.name ? `(${enemy.enemy_difficulty?.name})` : "";

    embed.setTitle(`${name} (Lv. ${level}) ${difficulty}`);

    next();
}

async function handleDescription(data: EnemyViewMiddleware, next: () => void){
    const area = data.enemy.area;

    const areaName = area.name;
    const location = area.location.name;
    const icon = area.location.location_type.icon?.discord_emoji;
    const locationType = area.location.location_type.name;

    data.embed.setDescription(`${areaName}\n${location}\n${icon} ${locationType}`);

    next();
}

async function handleHp({embed, enemy}: EnemyViewMiddleware, next: () => void){
    if(!enemy.hp)
        return;

    const hp = enemy.hp?.toLocaleString();

    embed.addFields([{
        name: `HP`,
        value: hp,
        inline: true,
    }]);

    next();
}

async function handleElement({embed, enemy}: EnemyViewMiddleware, next: () => void){
    const elementName = enemy.element.element.name;
    const elementWeakness = enemy.element.weakness.name;

    embed.addFields([{
        name: `${emojis["skill_overlimit"]} element`,
        value: `**${elementName}**\nweak to **${elementWeakness}**`,
        inline: true,
    }]);

    next();
}

async function handleExp({embed, enemy}: EnemyViewMiddleware, next: () => void){
    embed.addFields([{
        name: `${emojis["stats_experience"]} Base EXP`,
        value: `${enemy.base_exp}`,
        inline: true,
    }]);

    next();
}

async function handleDrop({embed, enemy}: EnemyViewMiddleware, next: () => void){
    embed.addFields([{
        name: `${emojis["item_chest_wood"]} Drops`,
        value: enemy.drops.map(drop => `${drop.icon?.discord_emoji ?? ""} ${drop.name}`)
        .join("\n")
    }])

    next();
}

const handler = middlewareEngine<EnemyViewMiddleware>(
    handleTitle,
    handleDescription,
    handleElement,
    handleHp,
    handleExp,
    handleDrop,
);

export async function enemyDetail(enemy: EnemyView): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const embed = new MyEmbedBuilder();

    await handler({
        enemy,
        embed
    });

    const selectMenu = new StringSelectMenuBuilder();
    selectMenu
        .setPlaceholder(`Select from this box to search for item drop`)
        .setCustomId("item");
    
    for(const item of enemy.drops){
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

        selectMenu.addOptions(strSelect);
    }

    const row = new ActionRowBuilder();
    row.addComponents(selectMenu)

    return {
        embeds: [embed], 
        components: [row as any]
    };
}