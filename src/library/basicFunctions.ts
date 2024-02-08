import { prefixes } from "@config";
import { APIEmbed, Embed, EmbedBuilder, EmbedData } from "discord.js";

export class MyEmbedBuilder extends EmbedBuilder{
    constructor(data?: EmbedData | APIEmbed | undefined){
        super(data);

        if(!this.data.color)
            this.setColor("Yellow");
    }

    /**
     * a function factory for error embed
     * @param data embed data
     */
    setError(data: {
        description: string, 
        title?: string, 
        footer?: string
    }){
        this.data.title = data.title ?? ":warning:     error   :warning:";
        this.data.description = data.description;
        this.data.footer = {text: data.footer ?? `for command list, type ${prefixes[0]} help!`};
        this.setColor("Red");

        return this;
    }
}

/**
 * returns a random integer between min and max (max included)
 * @param min minimum value (rounded down)
 * @param max maximum value (rounded up)
 * @returns number between min and max
 */
export function rngInt(min: number, max: number){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max);
}

/**
 * returns a random number between min and max
 * @param min minimum value
 * @param max maximum value
 * @returns number between min and max
 */
export function rng(min: number, max: number){
    return Math.random() * Math.abs(max - min) + Math.min(max, min);
}

/**
 * sleeps for a given amount of time (async function)
 * @param ms time in milliseconds
 * @returns void
 */
export async function sleep(ms: number){
    return new Promise<void>((res, _) => {
        setTimeout(() => {res()}, ms);
    })
}