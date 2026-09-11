import { DSATreeNode, MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import emojis from "@assets/data/emojis.json";
import z from "zod";
import { ItemView } from "@services/supabase/types/views/item";

export const ItemSchema = z.object({
    name: z.string().min(2)
});

export type I_Item = z.infer<typeof ItemSchema>;

export async function itemDetail(item: ItemView): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const embed = new MyEmbedBuilder();

    let mainIcon: string | null = null;

    if(item.item_processable){
        mainIcon = item.item_processable.material.icon?.discord_emoji ?? null;
        embed.addFields([{
            name: `${emojis["skill_process_materials"]} processed into`,
            value: `${item.item_processable.material?.icon?.discord_emoji} ${item.item_processable.process_point}pts`,
            inline: true,
        }]);
    }
        
    if(item.item_ore){
        mainIcon = emojis["item_ore"];
        embed.addFields([{
            name: `${emojis["item_ore"]} Ore`,
            value: `+${item.item_ore.refine_point} refine pts`,
            inline: true,
        }]);
    }

    if(item.item_tool)
        embed.addFields([{
            name: `${emojis["item_potion_red"]} Buff Duration`,
            value: `${item.item_tool.duration_minute} minutes`,
            inline: true,
        }]);

    if(item.item_sellable)
        embed.addFields([{
            name: `${emojis["item_coin_gold"]} Cashable`,
            value: `${item.item_sellable.sell} spina`,
            inline: true,
        }]);

    if(item.item_stats){
        let emoji = emojis["item_pouch"];
        let name = "Stats / Effects";
        let value = null;
        if(item.item_equipable){
            if(item.item_equipable.item_equipable_type.icon){
                mainIcon = item.item_equipable.item_equipable_type.icon?.discord_emoji;                
                emoji = item.item_equipable.item_equipable_type.icon?.discord_emoji;
            }

            name = item.item_equipable.item_equipable_type.name;

            value = "???"
            if(item.item_equipable.armor)
                value = `**DEF: ${item.item_equipable.armor.base_def ?? "???"}**`;
            if(item.item_equipable.weapon)
                value = `**ATK: ${item.item_equipable.weapon.base_atk ?? "???"} (${item.item_equipable.weapon.base_stability ?? "???"}%)**`
        }

        const noneStat = item.item_stats["none"] ?? [];
        delete item.item_stats.none;

        const other = item.item_stats;

        const statList: string[] = [];

        statList.push(...noneStat.map(stat => `${stat.stat.stat_markdown.replace("{amount}", (stat.amount < 0 ? "" : "+") + stat.amount.toString())}`))

        for(const [_, stats] of Object.entries(other)){
            statList.push(`**${stats[0].restriction.name}**:`);
            for(const stat of stats)
                statList.push(`${stat.stat.stat_markdown.replace("{amount}", (stat.amount < 0 ? "" : "+") + stat.amount.toString())}`)
        }
        
        embed.addFields([{
            name: `${emoji} ${name}`,
            value: [value, ...statList].join("\n"),
            inline: false
        }])
    }

    if(item.item_crysta){
        mainIcon = item.item_crysta.crysta_type.icon?.discord_emoji ?? null;

        if(item.item_crysta.upgrades.length > 0){
            const baseCrysta = item.item_crysta?.upgrades[0].base_crysta;
            const upgrades = item.item_crysta?.upgrades[0].upgrades;

            const map: Record<string, typeof baseCrysta[]> = {}

            for(const upgrade of upgrades)
                map[upgrade.upgrade_for.item.name] = [...(map[upgrade.upgrade_for.item.name] ?? []), upgrade.crysta];

            const tree = DSATreeNode.createTree(baseCrysta, (data) => {return map[data.item.name] ?? []});

            const found = DSATreeNode.find(tree, (data) => data.item.name === item.name);

            if(!found)
                throw new Error("cannot find the crysta tree");

            const arrLine: typeof baseCrysta[] = [];
            let isTree = false;
            for(let current = found; current !== undefined; current = current.nexts[0]){
                if(current.nexts.length > 1){
                    isTree = true
                    break;
                }
                else
                    arrLine.push(current.value);
            }

            let crystaList;
            if(isTree){
                const arr = DSATreeNode.toArray(found);

                crystaList = arr
                    .map(({data, depth}) => {
                        const icon_normal = data.crysta_type.icon;
                        const icon_highlight = data.crysta_type.icon_highlighted;
                        const txt = data.item.name
        
                        if(data.item.name === item.name)
                            return "\\|".repeat(depth) + ` ${(icon_highlight ?? icon_normal)?.discord_emoji} **${txt}**`;
                        else 
                            return "\\|".repeat(depth) + ` ${icon_normal?.discord_emoji} ${txt}`;
                    })
                    .join("\n")
            }
            else{
                const arr = found.prev ? DSATreeNode.linePredecessor(found.prev) : [];

                crystaList = [...arr, ...arrLine]
                    .map(upgrade => {
                        const icon_normal = upgrade.crysta_type.icon;
                        const icon_highlight = upgrade.crysta_type.icon_highlighted;
                        const txt = upgrade.item.name
        
                        if(upgrade.item.name === item.name)
                            return `${(icon_highlight ?? icon_normal)?.discord_emoji} **${txt}**`;
                        else 
                            return `${icon_normal?.discord_emoji} ${txt}`;
                    })
                    .join(" -> ")
            }
        
            embed.addFields([{
                name: `Upgradeable Crysta:`,
                value: crystaList
            }]);
        }
    }

    if(item.enemy){        
        const enemies = item.enemy.map(enemy => {
            const emoji = enemy.enemy_type.icon?.discord_emoji ?? "";
            const name = enemy.enemy.name;
            const difficulty = enemy.difficulty?.name ? `(${enemy.difficulty.name})` : "";
            const area = enemy.area.name;

            return `${emoji} ${name} ${difficulty}: ${area}`;
        })

        embed.addFields([{
            name: `${emojis["item_chest_wood"]} Obtained From`,
            value: enemies.join("\n"),
            inline: false,
        }]);
    }

    if(!item.is_verified)
        embed.setFooter({
            text: "this item is not verified yet! contact Chrez. A if you find any misinformation"
        })

    embed.setTitle(`${mainIcon} ${item.name}`);
    embed.setDescription(item.description);

    return {embeds: [embed]};
}