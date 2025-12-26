import {inlineCommandReturnTypes, YOLOModels} from "@library";
import { Message } from "discord.js";
import { yoloService } from "@shared/YoloService";
import fs from "fs";
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

            const json_data = {
                image: buffer.toString("base64")
            }

            const json_data_buffer = Buffer.from(JSON.stringify(json_data));

            try{
                const output = await yoloService.imageDetection(buffer, YOLOModels.YOLO11m);

                if("error" in output)
                    return;
                
                message.channel.send({
                    content: output.content,
                    files: [{attachment: output.image, name: `detection.png`}]
                });

            }
            catch(e){
                console.error("Error:", e);
            }
        }
    }
};

export default command;