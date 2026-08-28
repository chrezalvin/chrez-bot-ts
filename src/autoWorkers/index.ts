import workers from "./workers";
import { client } from "@shared/DiscordClient";

const debug = require("debug")("ChrezBot:workers");

debug("adding autoWorkers...");
for(const autoWorker of workers)
    try{
        debug(`registering autoworker ${autoWorker.name}`);
        autoWorker(client);
        debug(`autoworker ${autoWorker.name} has been registered successfully`);
    }
    catch(e: unknown){
        if(typeof e === "object" && e !== null)
            if("message" in e){
                if (typeof e.message === "string" || Array.isArray(e.message))
                    console.error(`error at autoWorker ${autoWorker.name}: ${e.message}`);
            }
        else
            console.error(`unknown error at autoWorker ${autoWorker.name}`);
    }
debug("Sucessfully added autoWorkers");
debug(`list of active autoWorkers: ${workers.map(w => w.name)}`);