import { MyEmbedBuilder, rngInt, Score } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const roshamboList = [
    {name: "rock", weakness: "paper", advantage:"scissor"},
    {name: "paper", weakness: "rock", advantage:"rock"},
    {name: "scissor", weakness: "rock", advantage:"paper"},
];

const score = new Score();

export const roshamboSchema = z.object({
    choice: z.string(),
});


export type I_Roshambo = z.infer<typeof roshamboSchema>;

export async function roshambo(args: I_Roshambo): Promise<MessageCreateOptions & InteractionReplyOptions>{
    let choice: string = args.choice;
    let botChoice = roshamboList[rngInt(0, roshamboList.length - 1)];

    const find = roshamboList.find(ros => ros.name === choice);
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

    return {embeds: [embed]};
}