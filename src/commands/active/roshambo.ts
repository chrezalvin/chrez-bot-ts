const debug = require("debug")("ChrezBot:quote");

import {CommandReturnTypes, getProfileByID, isChatInputCommandInteraction, isDiscordMessage, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import { prefixes } from "@config";

const roshambo = [
    {name: "rock", weakness: "paper", advantage:"scissor"},
    {name: "paper", weakness: "rock", advantage:"rock"},
    {name: "scissor", weakness: "rock", advantage:"paper"},
];

let winCount = 0;
let loseCount = 0;
let winStreak = 0;
let loseStreak = 0;
let drawStreak = 0;

function brag(){
    const embed = new MyEmbedBuilder()
        .setTitle("I wasnt supposed to brag but")
        .setDescription(`My winning percentage is ${Math.floor((winCount * 100)/loseCount)}%`)
}

const run: runCommand = (message , args?: string[]) => {
    let choice: string | null = null;
    let botChoice = roshambo[rngInt(0, roshambo.length - 1)];

    if(isChatInputCommandInteraction(message)){
        const getOpt = message.options.getString("choose", true);

        debug(`running command /roshambo choose: ${getOpt ?? "null"}`);

        choice = getOpt;
    }
    else{
        debug(`running command ${prefixes[0]} roshambo ${args !== undefined ? args.join(' '): ""}`);

        if(args)
            choice = args[0];
    }

    if(choice === null)
        throw new Error("Insert input to play roshambo game!");

    const find = roshambo.find(ros => ros.name === choice);
    if(find === undefined)
        throw new Error(`input ${choice.slice(0, 20)} is unknown`);
    

    const embed = new MyEmbedBuilder()
                .setTitle(`${find.name} vs ${botChoice.name}`);
                
    if(find.advantage === botChoice.name){
        embed.setDescription("You win!");
        ++loseCount;
        winStreak = 0;
        ++loseStreak;
        drawStreak = 0;
    }
    else if(botChoice.advantage === find.name){
        embed.setDescription("The bot win!");
        ++winCount;
        ++winStreak;
        loseStreak = 0;
        drawStreak = 0;
    }
    else{
        embed.setDescription("Oh wow it's a draw");
        winStreak;
        loseStreak = 0;
        winStreak = 0;
        ++drawStreak;
    }

    if(winStreak == 5 || winStreak == 10)
        embed.setFooter({text:`heh, I have won for like ${winStreak} times now`});
    else if(winStreak === 15)
        embed.setFooter({text:"lol :) 15 winstreak, i'm a god"});
    else if(loseStreak == 5 || loseStreak == 10)
        embed.setFooter({text:`I lost for like ${loseCount} times now, you're good`});
    else if(loseStreak === 15)
        embed.setFooter({text:"I call hax"});
    else if(drawStreak == 5 || drawStreak == 10)
        embed.setFooter({text:`oh wow ${drawStreak} draw strikes? ain't we lucky today`});
    else if(drawStreak === 15)
        embed.setFooter({text:`Maybe you should grab a lottery ticket, because we just got 15 draw strikes`});
    else if(rngInt(0, 100) % 5 === 0 && (winCount * 100) / loseCount > 90 && winStreak > 0)
        embed.setFooter({text:`i have ${Math.floor((winCount * 100) / loseCount)}% win rate, you can't defeat me`});
    else if(rngInt(0, 100) % 5 === 0 && (winCount * 100) / loseCount > 70 && winStreak > 0)
        embed.setFooter({text:`not gonna brag but i have ${Math.floor((winCount * 100) / loseCount)}% win rate`});

    return [embed];
}

const command: CommandReturnTypes = {
    name: "roshambo",
    alias: ["rps"],
    description: "plays rock paper scissor",
    examples: [
        {command: `${prefixes[0]} roshambo rock`}
    ],
    execute: async (message, args) => {
        const embeds = run(message, args);

        await message.channel.send({embeds});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("roshambo")
            .setDescription("Plays a rock paper scissor game")
            .addStringOption(option => {option
                    .setName("choose")
                    .setDescription("rock or paper or scissor")
                    .setRequired(true);
                    
                    for(const opt of roshambo )
                        option.addChoices({name: opt.name, value: opt.name});
                    return option;
                }),
        interact: async (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            
            const embeds = run(interaction);
            await interaction.reply({embeds});
        }
    }
};

export default command;