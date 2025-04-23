import {inlineCommandReturnTypes} from "@library";
import { Message } from "discord.js";
import { yoloService } from "@shared/YoloService";
import debug from "debug"; debug("ChrezBot:detect");

const acceptedContentTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const detectionCheck = (message: Message<boolean>) => {
    return message.attachments.size > 0;
}

const command: inlineCommandReturnTypes = {
    name: "detect",
    searchCriteria: [detectionCheck],
    description: "detects animals",
    execute: async (message) => {
        const attachment = message.attachments.first();
        debug("Attachment: ${attachment?.contentType}");
        if(attachment && attachment.contentType && acceptedContentTypes.includes(attachment.contentType)){
            // get the image
            const res = await fetch(attachment.url);
            const image = await res.arrayBuffer();

            // convert the image to a buffer
            const buffer = Buffer.from(image);

            try{
                const output = await yoloService.detect(buffer);

                if(output)
                    message.reply(output);
            }
            catch(e){
                console.error("Error:", e);
            }
        }
    }
};

export default command;