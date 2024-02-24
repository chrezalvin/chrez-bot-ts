import {MyEmbedBuilder, rngInt, CommandBuilder, ErrorValidation} from "@library";

import { SlashCommandBuilder } from "discord.js";
import stories from "@assets/messages/active/story.json";
import { prefixes } from "@config";

const run = (args?: I_Story) => {
    let index: number = args?.index ?? rngInt(0, stories.length - 1);

    if(index >= stories.length)
        return new ErrorValidation("index_out_of_bounds", 0, stories.length - 1);
    if(index < 0)
        return new ErrorValidation("index_negative");

    const story = stories[index];
    const embeds: MyEmbedBuilder[] = [];
    const sentences: string[] = [];
    let flagTitle: boolean = false;
    for(let iii = 0, count = 0; iii < story.description.length; ++iii){
        sentences.push(story.description[iii]);
        count += story.description[iii].length

        if(count > 2000){
            embeds.push(
                new MyEmbedBuilder()
                .setDescription(sentences.splice(0, sentences.length).join('\n\n'))
                .setTitle(!flagTitle ? `${story.title} by ${story.author}` : null)
            )

            count = 0;
            flagTitle = true;
        }
    }

    embeds.push(
        new MyEmbedBuilder()
        .setDescription(sentences.join("\n\n"))
        .setTitle(!flagTitle ? `${story.title} by ${story.author}` : null)
        .setFooter(story.footer ?{text: story.footer}: null)
    )

    return embeds;
}

interface I_Story{
    index: number;
}

const story = new CommandBuilder<I_Story>()
        .setName("story")
        .setAlias(["s"])
        .setDescription("Creates a random story")
        .setExamples([
            {command: `${prefixes[0]} story`, description: "give random story"},
            {command: `${prefixes[0]} story 3`, description: "give story #3"}
        ])
        .setSlash({
            slashCommand: new SlashCommandBuilder().setName("story")
                .setDescription("Creates a random story, you can specify which story you want using the option")
                .addIntegerOption(option => option.setName("index").setDescription("Index to target a story")),
            interact: async (interaction, args) => {
                const embeds = run(args);

                if(ErrorValidation.isErrorValidation(embeds))
                    return embeds;
    
                await interaction.reply({embeds});
            },
            getParameter: (interaction) => {
                const index = interaction.options.getInteger("index", false) ?? rngInt(0, stories.length - 1);
    
                return {index};
            }
        })
        .setChat({
            getParameter: (_, args) => {
                let index = rngInt(0, stories.length - 1);
                if(args && args[0] !== undefined){
                    let num = parseInt(args[0]);
                    if(!isNaN(num))
                        index = num;
                }
    
                return {index};
            },
            execute: async (message, args) => {
                const embeds = run(args);
   
                if(ErrorValidation.isErrorValidation(embeds))
                    return embeds;
                
                for(const embed of embeds)
                    await message.channel.send({embeds: [embed]});
            },
        })

export default story;