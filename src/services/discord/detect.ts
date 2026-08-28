import { ErrorValidation, MyEmbedBuilder, YOLOModelOption } from "@library";
import { yoloService } from "@shared/YoloService";
import { Attachment, AttachmentBuilder, ChannelType, ChatInputCommandInteraction, InteractionReplyOptions, Message, MessageCreateOptions } from "discord.js";
import z from "zod";

export const detectSchema = z.object({
    model: z.string(),
    image: z.custom<Attachment>(),
    message: z.custom<Message>().or(z.custom<ChatInputCommandInteraction>()),
});

export type I_Detect = z.infer<typeof detectSchema>;

export async function detect(args: I_Detect): Promise<MessageCreateOptions & InteractionReplyOptions>{
    if(!args.message.channel || args.message.channel.type !== ChannelType.GuildText)
        throw new ErrorValidation("command_restricted", "quote", "guild text channel");

    const url = args.image.url + "&format=webp";

    const res = await yoloService.imageDetection(url, args.model as YOLOModelOption);

    const embed = new MyEmbedBuilder();

    if("error" in res){
        embed.setTitle("Detection Error");
        embed.setDescription(res.error);
        return {embeds: [embed]};
    }

    const attachment = new AttachmentBuilder(res.image, {name: `detection.png`});

    embed
        .setImage(`attachment://detection.png`)
        .setTitle(res.content)
        .setFooter({text: `Model used: ${res.model}`});

    return {embeds: [embed], files: [attachment]};
}