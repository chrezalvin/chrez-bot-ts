import {MyEmbedBuilder, rngInt, CommandBuilder, ErrorValidation, Score} from "@library";

import { SlashCommandBuilder } from "discord.js";
import { prefixes } from "@config";

const roshambo = [
    {name: "rock", weakness: "paper", advantage:"scissor"},
    {name: "paper", weakness: "rock", advantage:"rock"},
    {name: "scissor", weakness: "rock", advantage:"paper"},
];

const score = new Score();

const run = (args: I_Roshambo) => {
    let choice: string = args.choice;
    let botChoice = roshambo[rngInt(0, roshambo.length - 1)];

    const find = roshambo.find(ros => ros.name === choice);
    if(find === undefined)
        throw new Error(`input ${choice.slice(0, 20)} is unknown`);

    const embed = new MyEmbedBuilder()
                .setTitle(`${find.name} vs ${botChoice.name}`);
    
    let description = "";
    if(find.advantage === botChoice.name){
        description = "You win!";
        score.lose();
    }
    else if(botChoice.advantage === find.name){
        description = "The bot win!";
        score.win();
    }
    else{
        description = "Oh wow it's a draw";
        score.draw();
    }

    let footerMessage: string | null = null;
    if( score.winStreakCount === 5 || score.winStreakCount === 10 )
        footerMessage = `heh, I have won for like ${score.winStreakCount} times now`;
    else if( score.winStreakCount === 15 )
        footerMessage = "lol :) 15 winstreak, i'm a god";
    else if( score.loseStreakCount === 5 || score.loseStreakCount === 10 )
        footerMessage = `I lost for like ${score.loseStreakCount} times now, you're good`;
    else if( score.loseStreakCount === 15 )
        footerMessage = "I call hax";
    else if( score.drawSteakCount === 5 || score.drawSteakCount === 10 )
        footerMessage = `oh wow ${score.drawSteakCount} draw strikes? ain't we lucky today`;
    else if( score.drawSteakCount === 15 )
        footerMessage = `Maybe you should grab a lottery ticket, because we just got 15 draw strikes`;
    else if( rngInt(0, 100) % 5 === 0 && score.winRate > 0.9 )
        footerMessage = `i have ${Math.floor(score.winRate * 100)}% win rate, you can't defeat me`;
    else if( rngInt(0, 100) % 5 === 0 && score.winRate > 0.7 )
        footerMessage = `not gonna brag but i have ${Math.floor(score.winRate * 100)}% win rate`;

    embed.setDescription(description);
    
    if(footerMessage !== null)
        embed.setFooter({text: footerMessage});

    return [embed];
}

interface I_Roshambo{
    choice: string;
}

const slashCommand = new SlashCommandBuilder().setName("roshambo")
    .setDescription("Plays a rock paper scissor game")
    .addStringOption(option => {option
            .setName("choose")
            .setDescription("rock or paper or scissor")
            .setRequired(true);
            
            for(const opt of roshambo )
                option.addChoices({name: opt.name, value: opt.name});
            return option;
    });

const chrezRoshambo = new CommandBuilder<I_Roshambo>()
    .setName("roshambo")
    .setAlias(["rps"])
    .setDescription("plays rock paper scissor")
    .setExamples([
        {command: `${prefixes[0]} roshambo rock`, description: ""}
    ])
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            const choice = interaction.options.getString("choose", true);

            return {choice};
        },
        interact: async (interaction, args) => {
            if(!args) 
                return new ErrorValidation("no_argument_provided");

            const embeds = run(args);

            await interaction.reply({embeds});
        }
    })
    .setChat({
        getParameter: (_, args) => {
            if(args.length === 0)
                throw new Error("pick rock paper or scissor to play the game");
    
            const choice: string = args[0];
    
            return {choice};
        },
        execute: async (message, args) => {
            if(!args) 
                return new ErrorValidation("no_argument_provided");

            const embeds = run(args);
    
            await message.channel.send({embeds});
        },
    })


export default chrezRoshambo;