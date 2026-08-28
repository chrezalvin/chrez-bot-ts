import { ChrezBotMiddlewareFunction, ChatContext, SlashContext } from "@library/ChrezBot";
import { GuildMember } from "discord.js";
const debug = require("debug")("middleware:requireVC");

export function requireVC(){
    const handleVCRequirement: ChrezBotMiddlewareFunction<SlashContext> = async (ctx, next) => {
        if(!(ctx.interaction.member instanceof GuildMember))
            return next(new Error("Interaction is not of a guild member's!"));

        const vc = ctx.interaction.member.voice.channel;
        if(!vc){
            debug(`user is not in vc, passing error to next()`);
            next(new Error("You need to be in a voice channel to play music"));
        }
        else{
            ctx.voiceChannel = vc;
            next();
        }
    }

    return handleVCRequirement;
}