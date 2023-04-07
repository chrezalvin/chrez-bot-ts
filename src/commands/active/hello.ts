import {CommandReturnTypes} from "@typings/customTypes";
import { SlashCommandBuilder } from "discord.js";

const command: CommandReturnTypes = {
    name: "hello",
    description: "saying hello whenever user says hello",
    execute: (message) => {
        if(!message.author.bot)
            message.channel.send("hi");
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("hello").setDescription("Says hello"),
        interact: (interaction) => {
            if(!interaction.isCommand())
                throw new Error("Bot can't reply the interaction received");

            interaction.reply(`Hello, ${interaction.member?.user.username}!`);
        }
    }
};

export default command;