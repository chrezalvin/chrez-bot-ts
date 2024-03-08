import { CommandBuilder, rngInt } from "@library";
import { SlashCommandBuilder } from "discord.js";

const hugs = [
    "hugs you, making you warm and tender. Until you reach al dente",
    "hugs you, making you feel like a warm and tender chicken",
    "\*hugs\*",
];

const slashCommandBuilder = new SlashCommandBuilder()
    .setName("hug")
    .setDescription("gives hug");

const hug = new CommandBuilder<undefined>()
    .setName("hug")
    .setDescription("gives hug")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        slashCommand: slashCommandBuilder,
        interact: async (interaction) => {

            const hug = hugs[rngInt(0, hugs.length - 1)];

            await interaction.reply(hug);
        },
    })
    .setChat({
        execute: async (message) => {
            const hug = hugs[rngInt(0, hugs.length - 1)];

            await message.channel.send(hug);
        },
    });

export default hug;