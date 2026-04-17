import {MyEmbedBuilder, CommandBuilder, ErrorValidation, getEmoji} from "@library";

import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { BOT_PREFIXES } from "@config";
import CraftingRecommendationService from "@services/craftingRecommendation";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Crafting) => {
    if(!args)
        return new ErrorValidation("something_not_found", "argument");

    const embed = new MyEmbedBuilder();

    embed.setAuthor({
        name: `Craft recommendations for profiency ${args.profiency}${args.difficulty ? ` and difficulty ${args.difficulty}` : ""}`,
        iconURL: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/crafting/blacksmith-skill.png"
    });

    const recommendations = await CraftingRecommendationService.getCraftingRecommendations(args.profiency, args.difficulty ?? args.profiency + 30);

    if(recommendations.length === 0)
        return new ErrorValidation("something_not_found", "crafting recommendations");

    embed.setFields(
        {
            name: "from cheapest to most expensive",
            value: recommendations
                .map(rec => {
                    let emoji = "";
                    switch(rec.gear_type){
                        case "one_handed_sword": emoji = getEmoji("sword"); break;
                        case "two_handed_sword": emoji = getEmoji("two_hand_sword"); break;
                        case "staff": emoji = getEmoji("staff"); break;
                        case "magic_device": emoji = getEmoji("magic_device"); break;
                        case "bowgun": emoji = getEmoji("bowgun"); break;
                        case "bow": emoji = getEmoji("bow"); break;
                        case "katana": emoji = getEmoji("katana"); break;
                        case "halberd": emoji = getEmoji("halbert"); break;
                        case "knuckles": emoji = getEmoji("knuckles"); break;
                        case "armor": emoji = getEmoji("normal_armor"); break;
                        case "additional": emoji = getEmoji("additional"); break;
                        case "special": emoji = getEmoji("special"); break;
                        case "dagger": emoji = getEmoji("dagger"); break;
                        case "arrow": emoji = getEmoji("arrow"); break;
                        case "shield": emoji = getEmoji("shield"); break;
                    }

                    return `${emoji} **${rec.equipment_name}** (Lv. ${rec.item_level} - ${args.difficulty ? `${args.difficulty}/${rec.difficulty}` : `diff: ${rec.difficulty}`})`;
                })
                .join("\n")
        }
    )

    if(!args.difficulty)
        embed.setFooter({
            text: `Tip: you can specify a difficulty to get more accurate recommendations, ex: ${BOT_PREFIXES[0]} crafting ${args.profiency} ${args.profiency + 30}`,
            iconURL: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/crafting/questnote.png"
        });

    embed.setThumbnail("https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/crafting/blacksmith.png");

    return {embeds: [embed], content: `(${recommendations.length} items found)`};
}

interface I_Crafting{
    profiency: number;
    difficulty?: number;
};

const quote = new CommandBuilder<I_Crafting>()
    .setName("crafting")
    .setAlias(["craft", "bs", "blacksmith"])
    .setDescription("Recommends mobs to farm for levelling up, based on your current level")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} crafting 100`, description: "recommended crafts for profiency level 100"},
        {command: `${BOT_PREFIXES[0]} crafting 100 135`, description: "recommended crafts for profiency level 100 and difficulty up to 135"},
    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("crafting")
            .setDescription("Recommends crafts to make based on your current profiency level and difficulty")
            .addIntegerOption(option => 
                option
                .setName("profiency_level")
                .setDescription("your current profiency level")
                .setMinValue(0)
                .setMaxValue(320)
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option
                .setName("difficulty")
                .setDescription("maximum difficulty of the crafts to recommend")
                .setMinValue(1)
                .setMaxValue(520)
            ),
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply(embeds);
        },
        getParameter(interaction) {
            const profiency = interaction.options.getInteger("profiency_level", true);
            const difficulty = interaction.options.getInteger("difficulty", false) || undefined;

            if(difficulty !== undefined && difficulty < profiency)
                throw new Error("Difficulty cannot be less than profiency level");

            return {
                profiency,
                difficulty
            };
        }
    })
    .setChat({
        getParameter(_, args) {
            let profiency: number | undefined = undefined;
            if(args && !isNaN(parseInt(args[0])))
                profiency = parseInt(args[0]);

            if(!profiency)
                return new ErrorValidation("something_not_found", "profiency");

            if(profiency < 1 || profiency > 320)
                return new ErrorValidation("index_out_of_bounds", 1, 320);

            args?.shift();

            let difficulty: number | undefined = undefined;
            if(args && args.length > 0 && !isNaN(parseInt(args[0])))
                difficulty = parseInt(args[0]);

            return {
                profiency,
                difficulty
            };
        },
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send(embeds);
        },
    })

export default quote;