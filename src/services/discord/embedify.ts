import { MyEmbedBuilder, rngInt } from "@library";
import { Attachment, InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";

export const colorList = [
    "Default",
    "White",
    "Aqua",
    "Green",
    "Blue",
    "Yellow",
    "Purple",
    "Fuchsia",
    "Gold",
    "Orange",
    "Red",
    "Grey",
    "Navy",
    "LightGrey",
    "DarkNavy",
    "Blurple",
    "Greyple",
] as const;


export const embedifySchema = z.object({
    description: z.string(), 
    title: z.string().nullable(),
    footer: z.string().nullable(),
    thumbnail: z.custom<Attachment>().nullable(),
    color: z.enum(colorList).nullable(),
    authorimage: z.custom<Attachment>().nullable(),
    footerimage: z.custom<Attachment>().nullable()
});

export type I_Embedify = z.infer<typeof embedifySchema>;

export async function embedify(args: I_Embedify): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const embed = new MyEmbedBuilder()
        .setDescription(args.description);

    if(args.title)
        embed.setTitle(args.title);

    if(args.color)
        embed.setColor(args.color);

    if(args.footer)
        embed.setFooter({text: args.footer, iconURL: args.footerimage?.url});

    if(args.thumbnail)
        embed.setThumbnail(args.thumbnail.url);
    if(args.authorimage)
        embed.setAuthor({name: "\u200B", iconURL: args.authorimage.url});

    return {embeds: [embed]};
}