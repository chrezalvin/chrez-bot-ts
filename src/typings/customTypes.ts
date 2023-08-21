import { MyEmbedBuilder } from "@modules/basicFunctions";
import {type Message, SlashCommandBuilder, Interaction, ClientEvents, Awaitable, ChatInputCommandInteraction, CacheType, DiscordAPIError} from "discord.js";
import guild_profiles from "@assets/data/profiles.json";

export interface Command{
    name: string;
    execute: (message: Message, args: string[]) => Awaitable<void>;
    unavailable?: boolean;
    description: string;
}

export interface EventReturnType<K extends keyof ClientEvents>{
    name: K;
    execute: (...args: ClientEvents[K]) => Awaitable<void>;
}

export interface CommandReturnTypes extends Command {
    alias?: string[];
    examples?: {command: string, description?: string}[];
    slash?:  {
        slashCommand: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
        interact: (interaction: ChatInputCommandInteraction<CacheType>) => Awaitable<void>;
    }
}

export interface inlineCommandReturnTypes extends Command {
    searchCriteria: (string | RegExp)[];
    execute: (message: Message) => void;
}

function isCommand(command: unknown): command is Command {
    if(typeof command !== "object" || !command) return false;
    if(!("name" in command) || typeof command.name !== "string") return false;
    if(!("description" in command) || typeof command.description !== "string") return false;
    if(!("execute" in command) || typeof command.execute !== "function") return false;

    return true;
}

export function isCommandReturnType(command: unknown): command is CommandReturnTypes{
    if(!isCommand(command)) return false;
    
    return true;
}

export function isInline(command: unknown): command is inlineCommandReturnTypes{
    if(!isCommand(command)) return false;
    if(!("searchCriteria" in command)) return false;
    
    if (!Array.isArray(command.searchCriteria)) return false;
    
    for(const search of command.searchCriteria){
        if(typeof search !== "string")
            if(typeof search !== "object" || !(search instanceof RegExp)) return false;
    }
    
    return true;
}

export function CommandReturnTypesChecking(obj: any): obj is CommandReturnTypes{
    if(typeof obj === "object"){
        const keys = ["name", "description", "execute"];
        for(const objKey of Object.keys(obj))
            if(keys.find((key) => key === objKey) === undefined) 
                return false;
    }
    
    return true;
}

/**
 * (Not recomended) 
 * typecheck for Message<boolean>
 * @param val
 * @returns 
 */
export function isDiscordMessage(val: unknown): val is Message<boolean>{
    if(typeof val !== "object" || val === null) return false;
    
    if("channel" in val)
        if(val.channel !== null && typeof val.channel === "object")
            if("send" in val.channel)
                return val.channel.send instanceof Function;

    return false;
}

/**
 * typecheck for Interaction
 * @param val
 * @returns 
 */
export function isChatInputCommandInteraction(val: unknown): val is ChatInputCommandInteraction<CacheType>{
    if(typeof val !== "object" || val === null) return false;

    if("isChatInputCommand" in val)
        if(val.isChatInputCommand instanceof Function)
            if(typeof val.isChatInputCommand() === "boolean")
                return val.isChatInputCommand();

    return false;
}

/**
 * run command type so it can deal with slash command and message command at the same time
 */
export type runCommand = {
    (message: Message<boolean>, args: string[]): MyEmbedBuilder[];
    (message: ChatInputCommandInteraction<CacheType>): MyEmbedBuilder[];
}

export async function importModule<_T>(path: string, ensureType?: (x: any) => x is _T){
    let imported =  await import(`/${path}`) as unknown;
    if(imported != undefined && typeof imported === "object")
        if('default' in imported){
            imported = imported.default as _T;
        }
        else throw new Error(`Cannot found module default in the module ${path}`);
    else throw new Error("Cannot find the module");

    if(!ensureType) return imported as _T;
    else if(ensureType && ensureType(imported)) return imported;
    else throw new Error("imported path is not the expected type");
}

export function isDiscordAPIError(val: unknown): val is DiscordAPIError{
    if(typeof val === "object" && val !== null)
        if("code" in val)
            if("status" in val)
                if("message" in val)
                    if("rawError" in val)
                        return typeof val.rawError === "object";

    return false;
}