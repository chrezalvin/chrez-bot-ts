import { prefixes } from "@config";
import { APIEmbed, EmbedBuilder, EmbedData } from "discord.js";

interface MyEmbedData{
    description: string;
    title?: string;
    footer?: string;
}

export class MyEmbedBuilder extends EmbedBuilder{
    public static createError(data: MyEmbedData){
        const embed = new MyEmbedBuilder()
            .setTitle(data.title ?? ":warning:     error   :warning:")
            .setDescription(data.description)
            .setFooter({text: data.footer ?? `for command list, type ${prefixes[0]} help!`})
            .setColor("Red");

        return embed;
    }

    constructor(data?: EmbedData | APIEmbed | undefined){
        super(data);

        if(!this.data.color)
            this.setColor("Yellow");
    }
}