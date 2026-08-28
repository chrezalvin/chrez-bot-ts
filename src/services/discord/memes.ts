import { ErrorValidation, MyEmbedBuilder, rngInt } from "@library";
import { getMemeLength, getMemeUrl } from "@services/supabase/services/viewService/MemeView";
import { ChannelType, ChatInputCommandInteraction, InteractionReplyOptions, Message, MessageCreateOptions } from "discord.js";
import z from "zod";

export const memesSchema = z.object({
    index: z.number().min(0).optional(),
    nsfw: z.boolean(),
    message: z.custom<Message>().or(z.custom<ChatInputCommandInteraction>()),
});

export type I_Memes = z.input<typeof memesSchema>;

export async function memes(args: I_Memes): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = memesSchema.parse(args);

    const length = getMemeLength(parsed.nsfw);

    // checks if the channel is nsfwm
    if(parsed.nsfw){
        if(args.message.channel){
            if(args.message.channel.type === ChannelType.GuildText && !args.message.channel.nsfw)
                throw new ErrorValidation("command_restricted", "nsfw meme", "age restricted channel");
            else if(args.message.channel.type === ChannelType.DM){
                // continue
            }
            else 
                throw new ErrorValidation("command_restricted", "nsfw meme", "DM or nsfw channel");
        }
        else throw new Error("interaction received is not within a valid channel");
    }

    // checks for out of bounds error
    if(parsed.index)
        if(parsed.index >= length)
            throw new ErrorValidation("index_out_of_bounds", 0, length - 1);

    const url = getMemeUrl(parsed.nsfw, parsed.index);

    const embed = new MyEmbedBuilder({title: `meme#${url.index}`}).setImage(url.url);

    return {
        embeds: [embed]
    };
}