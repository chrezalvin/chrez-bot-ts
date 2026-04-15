import {MyEmbedBuilder, CommandBuilder, ErrorValidation} from "@library";

import { CacheType, ChannelType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { BOT_PREFIXES } from "@config";
import LevellingRecommendation from "@services/levellingRecommendation";
import { getEmoji } from "@library";
import { ActiveEventService, EventService } from "@services";

const levellingMultiplierDifference = [
    11,
    11,
    11,
    11,
    11,
    10,
    9,
    7,
    3,
    0.99
];

function levelPerc(currentLevel: number, exp: number){
    const nextLevelExp = 0.025 * currentLevel ** 4 + 2 * currentLevel;

    const perc = exp / nextLevelExp;

    // up to 2 decimal places
    return Math.round(perc * 10000) / 10000;
}

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Levelling) => {
    if(!args)
        return new ErrorValidation("something_not_found", "level");

    // get current ongoing events
    const events = await EventService.getActiveEvent();
    console.log(`current active events: ${events.map(event => event.title).join(", ")}`);

    const recommendations = await LevellingRecommendation.getLevellingRecommendations(args.lvl, events.map(event => event.event_id));

    if(recommendations.length === 0)
        return new ErrorValidation("something_not_found", "mobs");

    const embed = new MyEmbedBuilder();

    let note: null | string = null;
    let thumbnail: null | string = null;
    for(const rec of recommendations){
        const emoji = getEmoji(rec.mob_type === "boss" ? "boss" : "fighting");
        const levelDifference = Math.abs(rec.mob_level - args.lvl);
        const multiplier = levelDifference < levellingMultiplierDifference.length ? levellingMultiplierDifference[levelDifference] : 0.5;
        const event = rec.event ? events.find(event => event.event_id === rec.event) : null;
        let tags = "";

        // recommended note takes priority over non-recommended note
        // but if there are multiple recommended notes, the last one takes priority
        if(rec.note)
            if(!note)
                note = rec.note;
            else if(rec.is_recommended)
                note = rec.note;

        // if boss is event but still null, skip
        if(rec.event && !event)
            continue;

        if(rec.mob_image)
            if(!thumbnail)
                thumbnail = rec.mob_image;
            else if(rec.is_recommended)
                thumbnail = rec.mob_image;

        if(rec.is_best_with_party)
            tags += getEmoji("party");
        if(rec.is_mq_locked)
            tags += ` ${getEmoji("lock")}`;
        if(rec.is_recommended)
            tags += `${getEmoji("fit")}`;

        const mobExp = rec.mob_base_exp ? rec.mob_base_exp * multiplier : null;

        embed.addFields({
            name: `${emoji} ${rec.mob_name} [Lv. ${rec.mob_level} \`${Math.max(rec.mob_level - 8, 1)} - ${rec.mob_level + 8}\`] ${tags}`,
            value: [
                `**${rec.mob_element}** element`,
                `${getEmoji("teleport_ticket")}${event ? ` **[${event.title} Event]**`:""} ${rec.mob_location}`,
                `${getEmoji("experience")} ${mobExp === null ? "???": (mobExp).toLocaleString("en-US")} ${mobExp === null ? "" : `(${(levelPerc(args.lvl, mobExp) * 100).toFixed(1)}%)`}`,
            ].join("\n")
        })

    }
    
    if(note)
        embed.setFooter({
            iconURL: "https://cdn.discordapp.com/emojis/1490939833655496734.webp?size=64&quality=lossless",
            text: note
        })

    if(thumbnail){
        embed.setThumbnail(thumbnail);
        // default note if thumbnail is present
        if(!note)
            embed.setFooter({
                iconURL: "https://cdn.discordapp.com/emojis/1490939833655496734.webp?size=64&quality=lossless",
                text: `Note: The thumbnail represents the most recommended mob to farm`
            })
    }


    embed.addFields({
        name: "legend",
        value: ([
            {
                emoji: "party",
                description: "best with party"
            },
            {
                emoji: "lock",
                description: "mq locked"
            },
            {
                emoji: "fit",
                description: "recommended"
            }
        ] as const).map(tag => `${getEmoji(tag.emoji)}: ${tag.description}`).join("\n")
    })

    embed.setAuthor({
        iconURL: "https://cdn.discordapp.com/emojis/1491989760594542712.webp?size=64&quality=lossless",
        name: `Levelling for Lv. ${args.lvl}`
    })

    return {embeds: [embed], content: `(${recommendations.length} mobs found)`};
}

interface I_Levelling{
    lvl: number;
};

const quote = new CommandBuilder<I_Levelling>()
    .setName("levelling")
    .setAlias(["lvl", "lvling", "leveling", "farm", "lv", "level"])
    .setDescription("Recommends mobs to farm for levelling up, based on your current level")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} levelling 100`, description: "recommend mobs to farm for level 100"},
    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("levelling")
            .setDescription("Recommends mobs to farm for levelling up, based on your current level")
            .addIntegerOption(option => 
                option
                .setName("level")
                .setDescription("Level to recommend mobs for")
                .setMinValue(1)
                .setMaxValue(400)
                .setRequired(true)
            ),
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply(embeds);
        },
        getParameter(interaction) {
            const lvl = interaction.options.getInteger("level", true);

            return {lvl};
        }
    })
    .setChat({
        getParameter(_, args) {
            let lvl: number | undefined = undefined;
            if(args && !isNaN(parseInt(args[0])))
                lvl = parseInt(args[0]);

            if(!lvl)
                return new ErrorValidation("something_not_found", "level");

            if(lvl < 1 || lvl > 400)
                return new ErrorValidation("index_out_of_bounds", 1, 400);


            return {lvl};
        },
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send(embeds);
        },
    })

export default quote;