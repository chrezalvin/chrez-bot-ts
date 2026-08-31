const debug = require("debug")("ChrezBot:reloadDatabase");

import { CronJob } from "cron";
import { Channel, Client } from "discord.js";

let cache: Channel | undefined = undefined;

// reload the whole cache everyday
export default function setJapanTime(client: Client<boolean>){
    new CronJob("*/5 * * * *", async () => {
        debug("setting japan time");

        const channel = client.channels.cache.get("1544088076903653546");
        if(channel)
            cache = channel;
        else{
            const tryChannel = await client.channels.fetch("1544088076903653546");

            if(!tryChannel){
                debug("cannot find cached channel!");
                return;
            }

            cache = tryChannel;
        }
        
        const time = new Date();
        const localTime = time.toLocaleString("en-US", {timeZone: "Japan", hour12: true, timeStyle: "short"})

        if("setName" in cache){
            const channel = await cache.setName(`🕒 ${localTime} (JST)`);
            debug(`set channel to ${channel.name}`);
        }

    }, null, true, "Japan");
}