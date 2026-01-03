import {ChildProcess, spawn} from "child_process";
import fs from "fs";
const debug = require("debug")("library:YOLOService");

type YOLODetectResponse = {
    image: Buffer;
    content: string;
    model: string;
} | {
    error: string;
};

type YOLODetectRawResponse = {
    image_path: string;
    content: string;
    model: string;
} | {
    error: string;
} | null;

export enum YOLOModels{
    YOLO11m = "yolo11m",
    YOLO11s = "yolo11s",
    Neuronnet = "neuronnet",
}

function isYOLODetectRawResponse(obj: unknown): obj is YOLODetectRawResponse {
    if(typeof obj !== "object" || obj === null)
        return false;

    if("error" in obj){
        return typeof (obj as any).error === "string";
    }

    if(!("image_path" in obj) || typeof obj.image_path !== "string")
        return false;

    if(!("content" in obj) || typeof obj.content !== "string")
        return false;

    if(!("model" in obj) || typeof obj.model !== "string")
        return false;

    return true;
}

export class YOLOService{
    m_pythonProcess: ChildProcess | null = null;
    m_ready: boolean = false;
    private m_timeout = 5000; // 5 seconds timeout

    constructor(options?: {
        timeout?: number,
    }){
        if(options?.timeout)
            this.m_timeout = options.timeout;

        this.m_pythonProcess = spawn("python", ["./detection.py"], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        this.m_pythonProcess.on("spawn", () => {
            debug("Python process started");
            this.m_ready = true;
        })
    }

    private async communicate(data: string): Promise<string | null>{
        if(!this.m_ready){
            debug("Python process not ready");
            return null;
        }

        return await new Promise((resolve, reject) => {
            const buffer = Buffer.from(data);
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

    public async imageDetection(imageUrl: string, model: YOLOModels): Promise<YOLODetectResponse>{
        const json_data = {
            imageUrl: imageUrl,
            model: model
        }

        const response = await this.communicate(JSON.stringify(json_data));

        if(!response)
            return {error: "No response from detection service"};

        const resJson = JSON.parse(response);

        if(!isYOLODetectRawResponse(resJson))
            return {error: "Invalid response format"};

        if(!resJson)
            return {error: "No response from detection service"};

        if("error" in resJson)
            return {error: resJson.error};

        const imageBuffer = fs.readFileSync(resJson.image_path);

        return {
            image: imageBuffer,
            content: resJson.content,
            model: resJson.model
        };
    }

    shutdown(){
        this.m_pythonProcess?.stdin?.end();
        this.m_pythonProcess?.kill();
        this.m_ready = false;
        debug("Python process terminated");
    }
}