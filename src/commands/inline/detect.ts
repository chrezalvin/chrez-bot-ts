import {inlineCommandReturnTypes} from "@library";
import child_process from "child_process";
import { Message } from "discord.js";
import debug from "debug"; debug("ChrezBot:detect");

class YOLOService{
    m_pythonProcess: child_process.ChildProcess | null = null;
    m_ready: boolean = false;
    private m_timeout = 5000; // 5 seconds timeout

    constructor(){
        this.m_pythonProcess = child_process.spawn("python", ["./detection.py"], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        this.m_pythonProcess.on("spawn", () => {
            debug("Python process started");
            this.m_ready = true;
        })
    }

    public async detect(buffer: Buffer): Promise<string | null>{
        if(!this.m_ready){
            debug("Python process not ready");
            return null;
        }

        return await new Promise((resolve, reject) => {
            this.m_pythonProcess?.stdin?.write(buffer.toString("base64") + "\n", (err) => {
                if(err){
                    debug(`Error writing to stdin: ${err}`);
                    resolve(null);
                }

                const timeout = setTimeout(() => {
                    debug("Timeout waiting for Python process response");
                    this.m_pythonProcess?.stdout?.removeAllListeners("data");
                    resolve(null);
                }, this.m_timeout); // 5 seconds timeout

                debug("Image sent to Python process");
                this.m_pythonProcess?.stdout?.on("data", (data) => {
                    debug(`Data: ${data.toString()}`);
                    resolve(data.toString());

                    this.m_pythonProcess?.stdout?.removeAllListeners("data");

                    clearTimeout(timeout); // Clear the timeout if we get a response
                })

                this.m_pythonProcess?.stdout?.once("error", (error) => {
                    debug(`Error: ${error}`);
                    resolve(null);

                    clearTimeout(timeout); // Clear the timeout if we get an error
                });      
            });
        })
    }

    shutdown(){
        this.m_pythonProcess?.stdin?.end();
    }
}

const yolo = new YOLOService();

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
                const output = await yolo.detect(buffer);

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