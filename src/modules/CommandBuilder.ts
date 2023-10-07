import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

export interface ExampleField{
    command: string;
    description: string;
}

export class CommandBuilder {
    private m_name: string = "";
    private m_alias: string[] = [];
    private m_description: string = "";
    private m_examples: ExampleField[] = [];
    private m_slash: SlashCommandBuilder | null = null;

    constructor(
        data?:{
            name?: string, 
            alias?: string[], 
            description?: string,
            examples?: ExampleField[]
            slash?: SlashCommandBuilder
        }
    ){
        if(data){
            this.m_name = data.name ?? "";
            this.m_alias = data.alias ?? [];
            this.m_description = data.description ?? "";
            this.m_examples = data.examples ?? [];
            this.m_slash = data.slash ?? null;
        }
    }

    async run(callback: (
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>, 
        args: string[]) => Promise<EmbedBuilder[]>
    ){
        // const embeds = await callback("", []);
    }

    get name(){ return this.m_name; }
    get alias(){ return this.m_alias; }
    get description(){ return this.m_description; }
    get examples(){ return this.m_examples; }
    get slash(){
        return this.m_slash;
    }
}