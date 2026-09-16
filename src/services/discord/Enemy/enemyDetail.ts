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
    const title = [];

    if(enemy.enemy_type.icon)
        title.push(enemy.enemy_type.icon.discord_emoji);

    title.push(enemy.enemy_name);
    title.push(`Lv. ${enemy.level}`);

    if(enemy.difficulty_label)
        title.push(`(${enemy.difficulty_label})`);

    if(enemy.variant_label)
        title.push(`(${enemy.variant_label})`);
    
    embed.setTitle(title.join(" "));

    next();
}

async function handleDescription({embed, enemy}: EnemyViewMiddleware, next: () => void){
    const descriptions = [];

    descriptions.push(`${enemy.element} Element`);
    
    if(enemy.hp)
        descriptions.push(`HP: ${enemy.hp.toLocaleString()}`);
    
    if(enemy.base_exp)
        descriptions.push(`Base Exp: ${enemy.base_exp.toLocaleString()}`);
    
    embed.setDescription(descriptions.join("\n"));
    
    next();
}

async function handleEnemyBoss({embed, enemy}: EnemyViewMiddleware, next: () => void){
    if(enemy.enemy_boss){
        if(enemy.enemy_boss.has_difficulty){
            embed.addFields([{
                name: `${enemy.enemy_type.icon?.discord_emoji} Boss Enemy`,
                value: [
                    "The stat shown here are based on **Normal** Difficulty, to calculate the value from other difficulty, multiply base stat by:",
                    "Easy: x0.1, -10 level",
                    "Hard: x2, +10 level",
                    "Nightmare: x5, +20 level",
                    "Ultimate: x10, +40 level",
                ].join("\n"),
                inline: true,
            }]);
        }
        else{
            embed.addFields([{
                name: `${enemy.enemy_type.icon?.discord_emoji} Boss Enemy`,
                value: "this enemy is a boss without difficulty scaling",
                inline: true,
            }]);
        }
    }

    next();
}

async function handleArea({embed, enemy}: EnemyViewMiddleware, next: () => void){   
    if(enemy.area.length > 0)
        embed.addFields([{
            name: `${emojis["system_ui_world_iruna"]} found at:`,
            value: enemy.area.map(e => `${e.location.location_type?.icon?.discord_emoji ?? ""} ${e.name} - ${e.location.name}`).join("\n")
        }])

    next();
}

async function handleDrop({embed, enemy}: EnemyViewMiddleware, next: () => void){
    embed.addFields([{
        name: `${emojis["item_chest_wood"]} Drops`,
        value: enemy.drops.map(drop => {
            const title = [];

            if(drop.icon)
                title.push(drop.icon.discord_emoji);

            title.push(drop.name);

            if(drop.item_equipable?.label){
                const label = [];

                if(drop.item_equipable.label.icon)
                    label.push(drop.item_equipable.label.icon.discord_emoji);

                label.push(drop.item_equipable.label.name);

                title.push(`(${label.join(" ")})`)
            }

            return title.join(" ");
        }).join("\n")
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
    handleDrop,
    handleArea,
    handleEnemyBoss,
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