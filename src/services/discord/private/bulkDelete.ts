import { MyEmbedBuilder } from "@library";
import { CacheType, ChatInputCommandInteraction, Collection, GuildTextBasedChannel, InteractionReplyOptions, Message, MessageCreateOptions, TextBasedChannel } from "discord.js";
import z from "zod";

export const bulkDeleteSchema = z.object({
    message: z.custom<Message<boolean> | ChatInputCommandInteraction<CacheType>>(),
    amount: z.number().min(1).max(100),
    channel: z.custom<TextBasedChannel>(),
    filterMessage: z.any(), // TODO,
    messageTimeout: z.number(),
});

export type I_BulkDelete = z.input<typeof bulkDeleteSchema>;

export async function bulkDelete(args: I_BulkDelete): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = bulkDeleteSchema.parse(args);
    
    // check if the message sent is from a guild
    if(!parsed.message.guild)
        throw new Error("Unknown guild ID");

    if(!parsed.message.guild.members.me)
        throw new Error("Bot is not in the guild");

    if(!parsed.message.guild.members.me.permissions.has("ManageMessages"))
        throw new Error("Chrezbot doesn't have permission to delete in this channel!");

    // fetch the message from the channel
    const messages = await parsed.channel.messages.fetch({limit: parsed.amount + 1});

    // delete messages except for the command reply
    const filtered = (messages as Collection<string, Message<boolean>>).filter(args.filterMessage);

    const res = await (args.channel as GuildTextBasedChannel).bulkDelete(filtered, true)

    if(res === undefined) throw new Error("Failed to delete message!");

    const embed = new MyEmbedBuilder()
            .setTitle("delete messages")
            .setDescription(`successfully deleted ${res.size} messages`)
            .setFooter({text: `This message will be deleted in ${parsed.messageTimeout} seconds`});

    return {embeds: [embed]};
}