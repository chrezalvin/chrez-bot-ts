import {InlineCommandReturnTypes, YOLOModels} from "@library";
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

const command: InlineCommandReturnTypes = {
    name: "detect",
    searchCriteria: [detectionCheck],
    description: "detects animals",
    execute: async (message) => {
        const attachment = message.attachments.first();
        debug("Attachment: ${attachment?.contentType}");
        if(attachment && attachment.contentType && acceptedContentTypes.includes(attachment.contentType)){
            try{
                const url = attachment.url + "&format=webp";
                const output = await yoloService.imageDetection(url, YOLOModels.YOLO11m);

                if("error" in output)
                    return;

                console.log("Sending detection result...");
                message.channel.send({
                    content: output.content,
                    files: [{attachment: output.image, name: `detection.webp`}]
                });

            }
            catch(e){
                console.error("Error:", e);
            }
        }
    }
};

export default command;