import {inlineCommandReturnTypes} from "@library";
import child_process from "child_process";

async function detectImage(buffer: any): Promise<string | null>{
    return await new Promise((resolve, reject) => {
        const pythonProcess = child_process.spawn("python", ["./detection.py"], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        // write the buffer to the python process
        pythonProcess.stdin.write(buffer);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data", (data) => {
            console.log("Data:", data.toString());
            resolve(data.toString());
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error("Error:", data.toString());
            reject(data.toString());
        });

        pythonProcess.on("exit", () => {
            console.log("Process exited");
            resolve(null);
        });
    })
}

const acceptedContentTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const command: inlineCommandReturnTypes = {
    name: "detect",
    searchCriteria: [/.*/],
    description: "detects cat and dog",
    execute: async (message) => {
        // check if image exist within the message
        console.log(message.attachments.size);
        if(message.attachments.size > 0){
            console.log("Attachment found, attempting to do an image detection");

            const attachment = message.attachments.first();
            console.log("Attachment: ", attachment?.contentType);
            if(attachment && attachment.contentType && acceptedContentTypes.includes(attachment.contentType)){
                // get the image
                const res = await fetch(attachment.url);
                const image = await res.arrayBuffer();

                // convert the image to a buffer
                const buffer = Buffer.from(image);

                try{
                    const output = await detectImage(buffer);

                    if(output)
                        message.channel.send(output);
                }
                catch(e){
                    console.error("Error:", e);
                }
            }
        }

    }
};

export default command;