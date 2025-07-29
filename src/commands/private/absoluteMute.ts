import { MyEmbedBuilder, CommandBuilder } from "@library";
import { absoluteMuted, setAbsoluteMute } from "@shared/isAbsoluteMuted";

const run = (args?: I_Mute) => {
    let flagMute: boolean = args?.absolutemute ?? true;
    
    const embed = new MyEmbedBuilder();
    if(flagMute == absoluteMuted)
        embed.setDescription(`Chrezbot is already ${absoluteMuted ? "Absolutely Muted": "Unmuted"}`);
    else{
        setAbsoluteMute(flagMute)
        embed.setTitle(`Chrezbot has been ${flagMute? "Absolutely Muted": "Unmuted"}!`)
        if(flagMute)
            embed.setDescription("All commands have been disabled until the owner unmute the bot");
    }

    return [embed];
}

interface I_Mute{
    absolutemute: boolean;
}

const absoluteMute = new CommandBuilder<I_Mute>()
        .setName("absolutemute")
        .setDescription("mute chrezbot for all commands and inline commands until unmuted")
        .setStatus("owner")
        .setChat({
            getParameter: (message, args) => {
                
                const muted = args[0] === "false" ? false : true;
                return {
                    absolutemute: muted
                };
            },
            execute: async (message, args) => {
                const res = run(args);
            
                await message.channel.send({embeds: res});
            }
        })

export default absoluteMute;