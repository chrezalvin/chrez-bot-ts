import error2 from "@assets/data/error2.json";
import { Message, ChatInputCommandInteraction, CacheType, Colors } from "discord.js";
import { MyEmbedBuilder, isChatInputCommandInteraction } from "@library";

export interface ErrorValidationData{
    code: number;
    name: string;
    description: string;
}

export type ErrorMessages = keyof typeof error2; 

export class ErrorValidation implements ErrorValidationData{
    readonly code: number;
    readonly name: string;
    readonly description: string;

    private static stringFormatter(str: string, args: (string | number)[]){
        if(args === undefined || args.length == 0)
            return str;
        else{
            return str.replace(/{(\d+)}/g, (_, number) => {
                const num = number as number;
                if(!isNaN(num) && args[num] !== undefined)
                    return `${args[num]}`;
                else
                    return "";
            })
        }
    }

    /**
     * send (or reply) acknowledged validation error to a channel
     * @param message discord message
     * @param error ErrorValidation object
     * @param deleteTime time in seconds before the message is deleted, defaulted to 10 seconds
     */
    public static async sendErrorValidation(
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>,
        error: ErrorValidation,
        deleteTime: number | null = 10,
    ){
        const embed = new MyEmbedBuilder({
            title:  error.name,
            description: error.description,
            color: Colors.Orange,
            footer: {text: `this message will be deleted in ${deleteTime} seconds`}
        });
    
        if(isChatInputCommandInteraction(message)){
            message.deferred ? await message.editReply({embeds: [embed]}) : await message.reply({embeds: [embed]});
            if(deleteTime)
                setTimeout(async () => {
                    message.deleteReply();
                }, deleteTime * 1000);
        }
        else if(message.channel.isSendable()){
            const msg = await message.channel.send({embeds: [embed]});
            if(deleteTime) 
                setTimeout(async () => {
                    if(msg.deletable)
                        await msg.delete();
                }, deleteTime * 1000);
        }
    }

    /**
     * send (or reply) unknown error to a channel
     * @param message discord message
     * @param error ErrorValidation object
     * @param deleteTime time in seconds before the message is deleted, defaulted to 10 seconds
     */
    public static sendUnknownError(
        message: Message<boolean> | ChatInputCommandInteraction<CacheType>,
        error: ErrorValidation,
        deleteTime: number | null = 10,
    ){
        const embed = new MyEmbedBuilder({
            title:  error.name,
            description: error.description,
            color: Colors.Red,
            footer: {text: `this message will be deleted in ${deleteTime} seconds`}
        });
    
        if(isChatInputCommandInteraction(message)){
            message.deferred ? message.editReply({embeds: [embed]}) : message.reply({embeds: [embed]});
            if(deleteTime)
                setTimeout(async () => {
                    message.deleteReply();
                }, deleteTime * 1000);
        }
        else if(message.channel.isSendable()){
            message.channel.send({embeds: [embed]});
            if(deleteTime) 
                setTimeout(async () => {
                    if(message.deletable)
                        await message.delete();
                }, deleteTime * 1000);
        }
    }

    public static isErrorValidation(obj: unknown): obj is ErrorValidation {
        return obj instanceof ErrorValidation;
    }

    constructor(error: ErrorMessages, ...args: (string | number)[]){
        this.code = error2[error].code;
        this.name = error2[error].name;
        this.description = ErrorValidation.stringFormatter(error2[error].description, args);
    }
}