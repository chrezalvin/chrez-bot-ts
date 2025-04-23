import {ChildProcess, spawn} from "child_process";
import debug from "debug"; debug("library:YOLOService");

export class YOLOService{
    m_pythonProcess: ChildProcess | null = null;
    m_ready: boolean = false;
    private m_timeout = 5000; // 5 seconds timeout

    constructor(){
        this.m_pythonProcess = spawn("python", ["./detection.py"], {
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