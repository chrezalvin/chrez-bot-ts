import { FileManager, Service } from "@library";
import { CronJob } from "cron";
import { Client } from "discord.js";

// reload the whole cache everyday
export default function reloadDatabase(client: Client<boolean>){
    new CronJob("0 0 * * *", async () => {
        console.log("reloading all cache");

        for(const service of Service.s_services)
            await service.getAllData(); // this will trigger all cache collect

        for(const fileManager of FileManager.s_filemanagers)
            await fileManager.getAllFiles(); // same here

        console.log("successfully reloaded all cache");
    }, null, true, "Japan");
}