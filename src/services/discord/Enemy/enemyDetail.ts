import { MyEmbedBuilder } from "@library";
import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import emojis from "@assets/data/emojis.json";
import { EnemyView } from "@services/supabase/types/views/enemy";
import { middlewareEngine } from "@library/middlewareEngine";

interface EnemyViewMiddleware{
    embed: MyEmbedBuilder;
    enemy: EnemyView;
    actionRow: ActionRowBuilder | null;
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
        return next();

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
        value: `**${elementName}** (weak to **${elementWeakness}**)`,
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
        value: enemy.drops.map(drop => `${drop.icon?.discord_emoji ?? ""} ${drop.name}`).join("\n")
    }]);

    next();
}

async function handleDropComponent(data: EnemyViewMiddleware, next: () => void){
    const {enemy, actionRow} = data;

    if(enemy.drops.length > 1){
        const selectMenu = new StringSelectMenuBuilder();
        selectMenu
            .setPlaceholder(`Select from this box to search for item drop`)
            .setCustomId("item");
        
        for(const item of enemy.drops){    
            const strSelect = new StringSelectMenuOptionBuilder();
            if(item.item_equipable)
                if(item.item_equipable.label)
                    strSelect.setDescription(item.item_equipable.label.name)
    
            if(item.icon)
                strSelect.setEmoji(item.icon.discord_emoji);
    
            strSelect
                .setValue(item.item)
                .setLabel(item.name);
    
            selectMenu.addOptions(strSelect);
        }
    
        const row = new ActionRowBuilder();
        row.addComponents(selectMenu)
    
        data.actionRow = row;
    }

    next();
}

const handler = middlewareEngine<EnemyViewMiddleware>(
    handleTitle,
    handleDescription,
    handleElement,
    handleHp,
    handleExp,
    handleDrop,
    handleDropComponent,
);

export async function enemyDetail(enemy: EnemyView): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const data: EnemyViewMiddleware = {
        enemy,
        embed: new MyEmbedBuilder(),
        actionRow: null
    }

    await handler(data);

    return {
        embeds: [data.embed],
        components: data.actionRow ? [data.actionRow as any] : undefined
    };
}