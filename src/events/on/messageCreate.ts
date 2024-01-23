const debug = require("debug"); debug("Event:MessageCreate");

import {prefixes} from "@config";

import {EventArguments} from "../"

const event: EventArguments<"messageCreate"> = ["messageCreate", (message) => {
           // Chrez time (need spacing)
           let prefixFlag = false;
           for(const prefix of prefixes)
               if(message.content.split(" ")[0].startsWith(prefix)) prefixFlag = true;
           if(!prefixFlag) return;
   
           // remove the prefix and make each word as parameter
           let params = message.content.trim().split(/ +/);
           params.shift();
   
           // first argument is the command                       v assert, it have atleast 1 array so it's safe
           const command = params.length == 0 ? "": params.shift()?.toLowerCase();
   
           console.log(message.content);
           console.log(command);
}]

export default event;