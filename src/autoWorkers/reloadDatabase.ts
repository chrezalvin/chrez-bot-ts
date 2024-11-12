const debug = require("debug")("ChrezBot:reloadDatabase");

import {ServiceSupabase, FileManagerSupabase} from "@library";
import { CronJob } from "cron";
import { Client } from "discord.js";


// reload the whole cache everyday
export default function reloadDatabase(_: Client<boolean>){
    new CronJob("0 0 * * *", async () => {
        debug("reloading all cache");

        for(const service of ServiceSupabase.s_services)
            await service.getAll(); // this will trigger all cache collect

        for(const fileManager of FileManagerSupabase.s_fileManagers)
            await fileManager.getAllFiles(); // same here

        console.log("successfully reloaded all cache");
    }, null, true, "Japan");
}