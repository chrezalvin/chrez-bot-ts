import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
const debug = require("debug")("middleware:requireVC");

export function requireVC(){
    const handleVCRequirement: ChrezBotMiddlewareFunction<ChatContext> = async (ctx, next) => {

        const vc = ctx.message.member?.voice.channel;
        if(!vc){
            debug(`user is not in vc, passing error to next()`);
            ctx.message.channel.send("You need to be in a voice channel to play music");
        }
        else{
            ctx.voiceChannel = vc;
            next();
        }
    }

    return handleVCRequirement;
}