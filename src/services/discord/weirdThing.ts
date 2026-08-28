const debug = require("debug")("ChrezBot:weirdThing");

import { rngInt } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";
import weirdList from "@assets/messages/active/weird.json";

export const weirdThingSchema = z.object({
    
});

export type I_WeirdThing = z.infer<typeof weirdThingSchema>;

export async function weirdThing(args: I_WeirdThing): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const weird = weirdList[rngInt(0, weirdList.length - 1)];

    return {content: weird};
}