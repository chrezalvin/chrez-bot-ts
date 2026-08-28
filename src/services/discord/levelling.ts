import { ErrorValidation, getEmoji, MyEmbedBuilder, YOLOModelOption } from "@library";
import { Attachment, AttachmentBuilder, ChannelType, ChatInputCommandInteraction, InteractionReplyOptions, Message, MessageCreateOptions } from "discord.js";
import z from "zod";

export const levellingSchema = z.object({
    lvl: z.number()
});

export type I_Levelling = z.infer<typeof levellingSchema>;

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

export async function levelling(args: I_Levelling): Promise<MessageCreateOptions & InteractionReplyOptions>{
    return {content: "TODO"};
    // // get current ongoing events
    // const events = await EventService.getActiveEvent();

    // const recommendations = await LevellingRecommendation.getLevellingRecommendations(args.lvl, events.map(event => event.event_id));

    // if(recommendations.length === 0)
    //     throw new ErrorValidation("something_not_found", "mobs");

    // const embed = new MyEmbedBuilder();

    // let note: null | string = null;
    // let thumbnail: null | string = null;
    // for(const rec of recommendations){
    //     const emoji = getEmoji(rec.mob_type === "boss" ? "boss" : "fighting");
    //     const levelDifference = Math.abs(rec.mob_level - args.lvl);
    //     const multiplier = levelDifference < levellingMultiplierDifference.length ? levellingMultiplierDifference[levelDifference] : 0.5;
    //     const event = rec.event ? events.find(event => event.event_id === rec.event) : null;
    //     let tags = "";

    //     // recommended note takes priority over non-recommended note
    //     // but if there are multiple recommended notes, the last one takes priority
    //     if(rec.note)
    //         if(!note)
    //             note = rec.note;
    //         else if(rec.is_recommended)
    //             note = rec.note;

    //     // if boss is event but still null, skip
    //     if(rec.event && !event)
    //         continue;

    //     if(rec.mob_image)
    //         if(!thumbnail)
    //             thumbnail = rec.mob_image;
    //         else if(rec.is_recommended)
    //             thumbnail = rec.mob_image;

    //     if(rec.is_best_with_party)
    //         tags += getEmoji("party");
    //     if(rec.is_mq_locked)
    //         tags += ` ${getEmoji("lock")}`;
    //     if(rec.is_recommended)
    //         tags += `${getEmoji("fit")}`;

    //     const mobExp = rec.mob_base_exp ? rec.mob_base_exp * multiplier : null;

    //     embed.addFields({
    //         name: `${emoji} ${rec.mob_name} [Lv. ${rec.mob_level} \`${Math.max(rec.mob_level - 8, 1)} - ${rec.mob_level + 8}\`] ${tags}`,
    //         value: [
    //             `**${rec.mob_element}** element`,
    //             `${getEmoji("teleport_ticket")}${event ? ` **[${event.title} Event]**`:""} ${rec.mob_location}`,
    //             `${getEmoji("experience")} ${mobExp === null ? "???": (mobExp).toLocaleString("en-US")} ${mobExp === null ? "" : `(${(levelPerc(args.lvl, mobExp) * 100).toFixed(1)}%)`}`,
    //         ].join("\n")
    //     })

    // }
    
    // if(note)
    //     embed.setFooter({
    //         iconURL: "https://cdn.discordapp.com/emojis/1490939833655496734.webp?size=64&quality=lossless",
    //         text: note
    //     })

    // if(thumbnail){
    //     embed.setThumbnail(thumbnail);
    //     // default note if thumbnail is present
    //     if(!note)
    //         embed.setFooter({
    //             iconURL: "https://cdn.discordapp.com/emojis/1490939833655496734.webp?size=64&quality=lossless",
    //             text: `Note: The thumbnail represents the most recommended mob to farm`
    //         })
    // }


    // embed.addFields({
    //     name: "legend",
    //     value: ([
    //         {
    //             emoji: "party",
    //             description: "best with party"
    //         },
    //         {
    //             emoji: "lock",
    //             description: "mq locked"
    //         },
    //         {
    //             emoji: "fit",
    //             description: "recommended"
    //         }
    //     ] as const).map(tag => `${getEmoji(tag.emoji)}: ${tag.description}`).join("\n")
    // })

    // embed.setAuthor({
    //     iconURL: "https://cdn.discordapp.com/emojis/1491989760594542712.webp?size=64&quality=lossless",
    //     name: `Levelling for Lv. ${args.lvl}`
    // })

    // return {embeds: [embed], content: `(${recommendations.length} mobs found)`};
}