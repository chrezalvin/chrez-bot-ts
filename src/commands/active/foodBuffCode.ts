import { MyEmbedBuilder, CommandBuilder } from "@library";
import { FoodBuffCode, foodBuffTypes } from "@models/FoodBuffCode";
import { UserService } from "@services";
import { getFoodBuffCodes, getFoodBuffCodesFromTypes, getGuildFoodBuffCodes } from "@services/FoodBuffCode";
import { SlashCommandBuilder } from "discord.js";

const alternativeFoodBuffTypeNames: Record<FoodBuffCode["food_buff"], string[]> = {
    "atk": ["a"],
    "matk": ["m"],
    "damage_to_dark": ["dark", "dtedark", "dted", "d"],
    "damage_to_light": ["light", "dtelight", "dtel", "l"],
    "damage_to_fire": ["fire", "dtefire", "dtef", "f"],
    "damage_to_earth": ["earth", "dteearth", "dtee", "e"],
    "damage_to_wind": ["wind", "dtewind", "dtew", "w"],
    "damage_to_water": ["water", "dtewater", "dtewa", "wa"],
    "damage_to_neutral": ["neutral", "dteneutral", "neut", "dten", "n"],
    "physical_resistance": ["pres", "pr"],
    "magical_resistance": ["mres", "mr"],
    "max_mp": ["mp", "maxmp"],
    "max_hp": ["hp", "maxhp"],
    "ampr": ["ampr"],
    "critical_rate": ["crit", "crt", "cr", "critical", "c"],
    "weapon_atk": ["watk"],
    "+aggro": ["aggro+", "+agg"],
    "-aggro": ["aggro-", "-agg"],
    "str": [],
    "dex": [],
    "int": [],
    "agi": [],
    "vit": [],
    "accuracy": ["acc"]
};

function translateAlternativeName(name: string): FoodBuffCode["food_buff"] | null{
    let nameUndercased = name.toLowerCase();

    if(foodBuffTypes.includes(nameUndercased as FoodBuffCode["food_buff"]))
        return nameUndercased as FoodBuffCode["food_buff"];

    for(const type of foodBuffTypes){
        const alternativeNames = alternativeFoodBuffTypeNames[type];
        if(alternativeNames.includes(nameUndercased)){
            return type;
        }
    }

    return null;
}

const run = async (args?: I_FoodBuffCode) => {
    if(args === undefined)
        return {embeds: [MyEmbedBuilder.createError({description: "Please provide a name"})]};

    if("set" in args){
        const foundTypes: FoodBuffCode["food_buff"][] = [];

        for(const stat of args.set){
            const foundType = translateAlternativeName(stat);
            if(foundType)
                foundTypes.push(foundType);
            else 
                return {embeds: [MyEmbedBuilder.createError({description: `Invalid food buff type: ${stat}`})]};
        }

        await UserService.setPreferredFoodBuffs(args.user_id, foundTypes);

        const embed = new MyEmbedBuilder()
            .setTitle("Preferred food buffs updated")
            .setDescription(`Your preferred food buffs have been updated to: ${foundTypes.map(type => `\`${type}\``).join(", ")}`);

        return {embeds: [embed]};
    }
    else{
        if(args.stat === "me"){
            const user = await UserService.getUser(args.user_id);

            if(user.preferred_food_buffs === null || user.preferred_food_buffs.length === 0)
                return {embeds: [MyEmbedBuilder.createError({description: "You don't have any preferred food buffs set."})]};

            const preferredFoodBuffs = await getFoodBuffCodesFromTypes(user.preferred_food_buffs);

            const embed = new MyEmbedBuilder()

            embed.setTitle(`${user.username}'s Preferred Food Buffs`);
            for(const foodBuffType of user.preferred_food_buffs){
                embed.addFields({
                    name: foodBuffType,
                    value: preferredFoodBuffs
                        .filter(buff => buff.food_buff === foodBuffType)
                        .map(buff => `${buff.code} \`(Lv.${buff.level})\``)
                        .map(buff => `\n - ${buff}`)
                        .join("")
                })
            }

            return {embeds: [embed]}
        }
        if(args.stat === "guild"){
            const foodBuffs = await getGuildFoodBuffCodes();

            const guildRecords: Record<string, FoodBuffCode[]> = {};

            for(const foodBuff of foodBuffs)
                guildRecords[foodBuff.player_name] = [...(guildRecords[foodBuff.player_name] || []), foodBuff];

            const embed = new MyEmbedBuilder()

            embed.setTitle(`Guild Food Buff Codes`);
            embed.setDescription(
                Object.entries(guildRecords)
                    .map(record => `**${record[0]}**: ${record[1].map(buff => `${buff.food_buff} \`(Lv.${buff.level})\``).join(" & ")}`)
                    .map(buff => `\n - ${buff}`)
                    .join("")
            )

            return {embeds: [embed]};
        }
        else{
            if(args.stat === "")
                return {embeds: [MyEmbedBuilder.createError({description: "Please provide a name"})]};
            
            const foundType = translateAlternativeName(args.stat);

            if(!foundType)
                return {embeds: [MyEmbedBuilder.createError({description: "Invalid food buff type"})]};

            const foodBuffCodes = await getFoodBuffCodes(foundType);

            if(foodBuffCodes.length === 0)
                return {embeds: [MyEmbedBuilder.createError({description: "No codes found"})]};

            const embed: MyEmbedBuilder = new MyEmbedBuilder();

            embed.setTitle(`Food Buff Codes for \`${foundType}\``);
            embed.setDescription(
                foodBuffCodes
                    .map(code => `${code.code} \`(Lv.${code.level})\``)
                    .map(code => `\n - ${code}`)
                    .join("")
            )

            embed.setFooter({
                text: `alternative name for this buff: ${alternativeFoodBuffTypeNames[foundType].map(name => `${name}`).join(", ")}`
            })

            return {embeds: [embed]};
        }
    }
}

type I_FoodBuffCode = {
    stat: string;
    user_id: string;
} | {
    set: string[];
    user_id: string;
};

const chrezFoodBuffCode = new CommandBuilder<I_FoodBuffCode>()
    .setName("foodbuffcode")
    .setAlias(["code", "buffcode", "foodcode", "food"])
    .setMode("available")
    .setDescription("Search food buffs code by name")
    .setExamples([
        {
            command: "Chrez food str",
            description: "Searches for str food buff codes"
        },
        {
            command: "Chrez food guild",
            description: "Shows food buffs from guild members"
        },
        {
            command: "Chrez food me",
            description: "Searches for your preferred food buff codes"
        },
        {
            command: "Chrez food set atk, mp, crit",
            description: "Sets your preferred food buffs to `atk`, `mp`, and `crit`"
        }
    ])
    .setSlash({
        interact: async (interaction, args) => {
            const embeds = await run(args);
            
            await interaction.reply(embeds);
        },
        getParameter: (interaction) => {
            if(interaction.options.getString("set")){
                const setArgs = interaction.options.getString("set")!;
                const sets = setArgs.split(",").map(stat => stat.trim());

                if(sets.length > 4)
                    throw new Error("You can only set up to 4 stats");

                return {
                    set: sets,
                    user_id: interaction.user.id
                }
            }
            else{
                if(interaction.options.getString("stat") === null)
                    throw new Error("Please provide a name");

                return {
                    stat: interaction.options.getString("stat") || "",
                    user_id: interaction.user.id
                }
            }
        },
        slashCommand: new SlashCommandBuilder()
            .setName("foodbuffcode")
            .setDescription("Search food buff code by name")
            .addStringOption(option => 
                option.setName("stat")
                    .setDescription("Can be me / guild / a food buff type (ex: atk/mp/crit)")
                    .setRequired(false)
            )
            .addStringOption(option =>
                option.setName("set")
                    .setDescription("The stats of the codes you want to set, separate by comma (ex: \"atk, mp, crit\")")
                    .setRequired(false)
            )
    })
    .setChat({
        execute: async (message, args) => {
            const embeds = await run(args);
        
            await message.channel.send(embeds);
        },
        getParameter: (message, args) => {
            if (args[0] === "set"){
                args.shift();

                const setArgs = args.join("").split(",").map(stat => stat.trim());

                if(setArgs.length > 4)
                    throw new Error("You can only set up to 4 stats");

                return {
                    is_set: true,
                    set: setArgs,
                    user_id: message.author.id
                };
            }
            else{
                if(args.length === 0)
                    throw new Error("Please provide a name");

                return {
                    stat: args.join(""),
                    user_id: message.author.id
                }
            }
        }
    })

export default chrezFoodBuffCode;