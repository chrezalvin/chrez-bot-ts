import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { yoloService } from "@shared/YoloService";
import { Message } from "discord.js";
import debug from "debug";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommand } from "@commands/types";
 debug("ChrezBot:detect");

const acceptedContentTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const detectionCheck = (message: Message<boolean>) => {
    return message.attachments.size > 0;
}

const inline = new InlineCommandBuilder({
    name: "detect",
    searchCriteria: [detectionCheck],
    description: "detects animals or objects",
})

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const attachment = ctx.message.attachments.first();
    debug(`Attachment: ${attachment?.contentType}`);
    if(attachment && attachment.contentType && acceptedContentTypes.includes(attachment.contentType)){
        try{
            const url = attachment.url + "&format=webp";
            const output = await yoloService.imageDetection(url, "yolo11m-animals");

            if("error" in output)
                return;

            ctx.message.channel.send({
                content: output.content,
                files: [{attachment: output.image, name: `detection.webp`}]
            });

        }
        catch(e){
            console.error("Error:", e);
        }
    }
};

export default {inline, middlewares: [execute]} as InlineCommand;