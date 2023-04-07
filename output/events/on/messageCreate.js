"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
debug("Event:MessageCreate");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const event = {
    name: discord_js_1.Events.MessageCreate,
    execute: async (message) => {
        // Chrez time (need spacing)
        let prefixFlag = false;
        for (const prefix of _config_1.prefixes)
            if (message.content.split(" ")[0].startsWith(prefix))
                prefixFlag = true;
        if (!prefixFlag)
            return;
        // remove the prefix and make each word as parameter
        let params = message.content.trim().split(/ +/);
        params.shift();
        // first argument is the command                       v assert, it have atleast 1 array so it's safe
        const command = params.length == 0 ? "" : params.shift()?.toLowerCase();
        console.log(message.content);
        console.log(command);
    }
    // execute: (message: Message) => {
    //     debug(`${message.author.username}${message.author.bot ? "(bot)": ""}: ${message.content}`)
    //     try{
    //         let get = commands.find(p => p.name === message.content)
    //         if(get === undefined) return;
    //         debug(`received message command "${get.name}"`);
    //         get.execute(message);
    //     }
    //     catch(error: any){
    //         if(typeof error.message === 'string'){
    //             debug(`Error catched: ${error.message}`);
    //         }
    //         else if(typeof error === "string"){
    //             debug(`Error catched: ${error}`);
    //         }
    //         else if(typeof error === "object"){
    //             debug("Error caught no message found, full obj error:");
    //             debug(error);
    //         }
    //         else{
    //             debug("unknown error found");
    //         }
    // }
};
exports.default = event;
