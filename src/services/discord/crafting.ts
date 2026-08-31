import { BOT_PREFIXES } from "@config";
import { ErrorValidation, MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const craftingSchema = z.object({
    profiency: z.number(),
    difficulty: z.number().optional()
});

export type I_Crafting = z.infer<typeof craftingSchema>;

export async function crafting(args: I_Crafting): Promise<MessageCreateOptions & InteractionReplyOptions>{
    return {
        content: "not implemented!"
    };
    // TODO
    // const embed = new MyEmbedBuilder();

    // embed.setAuthor({
    //     name: `Craft recommendations for profiency ${args.profiency}${args.difficulty ? ` and difficulty ${args.difficulty}` : ""}`,
    //     iconURL: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/crafting/blacksmith-skill.png"
    // });

    // const recommendations = await CraftingRecommendationService.getCraftingRecommendations(args.profiency, args.difficulty ?? args.profiency + 30);

    // if(recommendations.length === 0)
    //     throw new ErrorValidation("something_not_found", "crafting recommendations");

    // embed.setFields(
    //     {
    //         name: "from cheapest to most expensive",
    //         value: recommendations
    //             .map(rec => {
    //                 let emoji = "";
    //                 switch(rec.gear_type){
    //                     case "one_handed_sword": emoji = getEmoji("sword"); break;
    //                     case "two_handed_sword": emoji = getEmoji("two_hand_sword"); break;
    //                     case "staff": emoji = getEmoji("staff"); break;
    //                     case "magic_device": emoji = getEmoji("magic_device"); break;
    //                     case "bowgun": emoji = getEmoji("bowgun"); break;
    //                     case "bow": emoji = getEmoji("bow"); break;
    //                     case "katana": emoji = getEmoji("katana"); break;
    //                     case "halberd": emoji = getEmoji("halbert"); break;
    //                     case "knuckles": emoji = getEmoji("knuckles"); break;
    //                     case "armor": emoji = getEmoji("normal_armor"); break;
    //                     case "additional": emoji = getEmoji("additional"); break;
    //                     case "special": emoji = getEmoji("special"); break;
    //                     case "dagger": emoji = getEmoji("dagger"); break;
    //                     case "arrow": emoji = getEmoji("arrow"); break;
    //                     case "shield": emoji = getEmoji("shield"); break;
    //                 }

    //                 return `${emoji} **${rec.equipment_name}** (Lv. ${rec.item_level} - ${args.difficulty ? `${args.difficulty}/${rec.difficulty}` : `diff: ${rec.difficulty}`})`;
    //             })
    //             .join("\n")
    //     }
    // )

    // if(!args.difficulty)
    //     embed.setFooter({
    //         text: `Tip: you can specify a difficulty to get more accurate recommendations, ex: ${BOT_PREFIXES[0]} crafting ${args.profiency} ${args.profiency + 30}`,
    //         iconURL: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/crafting/questnote.png"
    //     });

    // embed.setThumbnail("https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/crafting/blacksmith.png");

    // return {embeds: [embed], content: `(${recommendations.length} items found)`};
}