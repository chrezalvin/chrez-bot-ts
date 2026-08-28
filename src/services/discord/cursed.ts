import { ErrorValidation, MyEmbedBuilder } from "@library";
import { CursedView } from "@services/supabase/services";
import { ChannelType, ChatInputCommandInteraction, InteractionReplyOptions, Message, MessageCreateOptions } from "discord.js";
import z from "zod";

export const cursedSchema = z.object({
    index: z.number().min(0).optional(),
    message: z.custom<Message>().or(z.custom<ChatInputCommandInteraction>()),
});

export type I_Cursed = z.infer<typeof cursedSchema>;

export async function cursed(args: I_Cursed): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = cursedSchema.parse(args);

    if(parsed.message.channel)
        if(parsed.message.channel.type === ChannelType.GuildText)
            if(parsed.message.channel.nsfw)
                throw new ErrorValidation("command_restricted", "cursed image", "age restricted channel");

    if(parsed.index)
        if(parsed.index >= CursedView.getCursedLength())
            throw new ErrorValidation("index_out_of_bounds", 0,  CursedView.getCursedLength() - 1);

    const cursedUrl = await CursedView.getCursedUrl(parsed.index);
    const embed = new MyEmbedBuilder({title: `cursed #${cursedUrl.index}`}).setImage(cursedUrl.url);

    return {
        embeds: [embed]
    };
}