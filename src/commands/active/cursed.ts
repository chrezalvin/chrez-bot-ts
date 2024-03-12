import {MyEmbedBuilder, rngInt, CommandBuilder, ErrorValidation} from "@library";

import { SlashCommandBuilder, AttachmentBuilder, ChannelType, Message, ChatInputCommandInteraction, CacheType } from "discord.js";
import { prefixes } from "@config";
import { CursedService } from "services/cursed";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Cursed) => {
    const cursedListLength = CursedService.getCursedList().length;

    if(args === undefined) throw new Error("no argument provided");

    if(message.channel)
        if(message.channel.type === ChannelType.GuildText)
            if(!message.channel.nsfw)
                return new ErrorValidation("command_restricted", "cursed image", "age restricted channel");

    if(args.index >= cursedListLength)
        return new ErrorValidation("index_out_of_bounds", 0,  cursedListLength - 1);
    if(args.index < 0)
        return new ErrorValidation("index_negative");

    const cursedUrl = await CursedService.getCursedUrl(args.index);
    const embed = new MyEmbedBuilder({title: `cursed #${args.index}`}).setImage(cursedUrl);

    return [embed];
}

interface I_Cursed{
    index: number;
};

const cursed = new CommandBuilder<I_Cursed>({
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        {command: `${prefixes[0]} curse`, description: "give random cursed image"},
        {command: `${prefixes[0]} curse 19`, description: "give cursed image #19"}
    ],
    slash: {
        slashCommand: new SlashCommandBuilder().setName("cursed")
            .setDescription("Sends you a really cursed image")
            .addIntegerOption(opt => opt
              .setName("index")
              .setDescription("Index to specify which cursed image you want to see")
              .setMinValue(0)),
        interact: async (interaction, args) => {
            await interaction.deferReply();
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.editReply({embeds});
        },
        getParameter(interaction) {
            const index = interaction.options.getInteger("index", false) ?? rngInt(0, CursedService.getCursedList().length - 1);

            return {index};
        }
    },
    chat: {
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send({embeds});
        },
        getParameter(_, args) {
            let index = rngInt(0, CursedService.getCursedList().length - 1);

            if(args.length != 0){
                let num = parseInt(args[0]);
                if(!isNaN(num))
                    index = num;
            }

            return {index};
        }
    },
    status: "public",
});

export default cursed;