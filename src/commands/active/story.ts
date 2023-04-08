import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import stories from "@assets/messages/active/story.json";
import { prefixes } from "@config";

const run: runCommand = (message , args?: string[]) => {
    let index: number|null = rngInt(0, stories.length - 1);

    if(isChatInputCommandInteraction(message)){
        let num = message.options.getInteger("index", false);

        if(num !== null)
            index = num;
    }
    else{
        if(args && args[0] !== undefined){
            let num = parseInt(args[0]);
            if(!isNaN(num))
                index = num;
        }
    }

    if(index >= stories.length)
        throw new Error(`index out of bounds, please choose between 0 to ${stories.length - 1}`);
    if(index < 0)
        throw new Error(`index cannot be negative`);

    const story = stories[index];
    const embed = new MyEmbedBuilder()
        .setDescription(story.description.join("\n"))
        .setTitle(`${story.title} by ${story.author}`);

    return embed;
} 

const command: CommandReturnTypes = {
    name: "story",
    alias: [],
    description: "Creates a random story",
    examples: [
        {command: `${prefixes[0]} story`, description: "give random story"},
        {command: `${prefixes[0]} story 3`, description: "give story #3"}
    ],
    execute: (message, args) => {
        const embed = run(message, args);

        message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("story")
            .setDescription("Creates a random story, you can specify which story you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a story")),
        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
                
            const embed = run(interaction);
    
            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;