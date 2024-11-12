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
        if(typeof obj !== "object" || obj === null) return false;

        if(!("code" in obj) || typeof obj.code !== "number") return false;

        if(!("name" in obj) || typeof obj.name !== "string") return false;

        if(!("description" in obj) || typeof obj.description !== "string") return false;

        return true;
    }

    /**
     * show out of bounds error message
     * @param min minimum value
     * @param max maximum value
     * @example new ErrorValidation("index_out_of_bounds", 0, 10) -> "Index out of bounds, please choose between 0 to 10"
     */
    constructor(error: "index_out_of_bounds", min: number, max: number);

    /**
     * show negative index error message
     * @example new ErrorValidation("index_negative") -> "Index cannot be negative"
     */
    constructor(error: "index_negative");

    /**
     * show no argument provided error message
     * @example new ErrorValidation("no_argument_provided") -> "You did not provide any argument for this command"
     */
    constructor(error: "no_argument_provided");

    /**
     * show error when restricted command is used in a restricted channel
     * @param command the command that is restricted
     * @param restriction the restriction that is applied to the command
     * @example new ErrorValidation("command_restricted", "command", "nsfw channel") -> "I can only send command in nsfw channel"
     */
    constructor(error: "command_restricted", command: string, restriction: string);

    /**
     * show error when restricted command is used in a restricted channel
     * @example new ErrorValidation("slash_command_option_unavailable") -> "Slash option is not available for this command"
     */
    constructor(error: "slash_command_option_unavailable");

    /**
     * show error when public user tries to use a private command
     * @example new ErrorValidation("command_is_private") -> "This command is only available for private members!"
     */
    constructor(error: "command_is_private");

    /**
     * show error whenever a user's sender can't be verified
     * @example new ErrorValidation("command_user_not_found") -> "Cannot verify the sender of this command!"
     */
    constructor(error: "command_user_not_found");

    /**
     * show error when a user tries to use something that is not found
     * @param name the name of the thing that is not found
     * @example new ErrorValidation("something_not_found", "user") -> "User not found"
     */
    constructor(error: "something_not_found", name: string);

    /**
     * show error whenever user tries to use a command that is forbidden
     * @param reason reason why the command is forbidden
     * @example new ErrorValidation("forbidden", "this command is nsfw") -> "You are not allowed to use this action because this command is nsfw"
     */
    constructor(error: "forbidden", reason: string);

    constructor(error: ErrorMessages, ...args: (string | number)[]){
        this.code = error2[error].code;
        this.name = error2[error].name;
        this.description = ErrorValidation.stringFormatter(error2[error].description, args);
    }
}