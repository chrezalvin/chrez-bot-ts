import canvas from "canvas";
import fs from "fs";

import {MyEmbedBuilder, CommandBuilder, ErrorValidation} from "@library";

import { AttachmentBuilder, CacheType, ChannelType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Crysta) => {
    const embed = new MyEmbedBuilder();

    const img = canvas.createCanvas(400, 400);
    const ctx = img.getContext("2d");

    ctx.fillStyle = "#00FFFF";
    ctx.fillRect(0, 0, img.width, img.height);

    ctx.fillText("Test", 50, 50);

    const buffer = img.toBuffer();
    const attachment = new AttachmentBuilder(buffer, {name: "crysta.png"});

    embed.setTitle("Crysta Tree")
        .setDescription("This is a crysta tree")
        .setImage("attachment://crysta.png");

    return {embeds: [embed], files: [attachment]};
}

interface I_Crysta{
};

const crysta = new CommandBuilder<I_Crysta>()
    .setName("crysta")
    .setDescription("Creates a crysta tree")
    .setExamples([

    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder()
            .setName("crysta")
            .setDescription("Creates a crysta tree"),
        
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply(embeds);
        },
        getParameter(interaction) {
            return {};
        }
    })
    .setChat({
        getParameter(_, args) {
            return {};
        },
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send(embeds);
        },
    })

export default crysta;