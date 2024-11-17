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
     * 1
     * show general error message while sending a message
     * @example new ErrorValidation("general_error") -> "Something went wrong while sending message"
     */
    constructor(error: "message_error");

    /**
     * 2
     * show general error message while using slash command
     * @example new ErrorValidation("slash_error") -> "slash error"
     */
    constructor(error: "slash_error");

    /**
     * 3
     * show interaction error message
     * @example new ErrorValidation("interaction_error") -> "interaction error"
     */
    constructor(error: "interaction_error");

    /**
     * 3
     * show out of bounds error message
     * @param min minimum value
     * @param max maximum value
     * @example new ErrorValidation("index_out_of_bounds", 0, 10) -> "Index out of bounds, please choose between 0 to 10"
     */
    constructor(error: "index_out_of_bounds", min: number, max: number);

    /**
     * 4
     * show negative index error message
     * @example new ErrorValidation("index_negative") -> "Index cannot be negative"
     */
    constructor(error: "index_negative");

    /**
     * 5
     * show no argument provided error message
     * @example new ErrorValidation("no_argument_provided") -> "You did not provide any argument for this command"
     */
    constructor(error: "no_argument_provided");

    /**
     * 6
     * show error when restricted command is used in a restricted channel
     * @param command the command that is restricted
     * @param restriction the restriction that is applied to the command
     * @example new ErrorValidation("command_restricted", "command", "nsfw channel") -> "I can only send command in nsfw channel"
     */
    constructor(error: "command_restricted", command: string, restriction: string);

    /**
     * 7
     * show error when restricted command is used in a restricted channel
     * @example new ErrorValidation("slash_command_option_unavailable") -> "Slash option is not available for this command"
     */
    constructor(error: "slash_command_option_unavailable");

    /**
     * 8
     * show error when the option in chat command is not available
     * @example new ErrorValidation("chat_command_option_unavailable") -> "Chat option is not available for this command"
     */
    constructor(error: "chat_command_option_unavailable");

    /**
     * 9
     * show error when the command in chat command is not available
     * @param command the command that is not available
     * @example new ErrorValidation("chat_command_unavailable", "nonce") -> "Chat command is not available for command nonce"
     */
    constructor(error: "chat_command_unavailable", command: string);

    /**
     * 10
     * show error when the command in slash command is not available
     * @param command the command that is not available
     * @example new ErrorValidation("slash_command_unavailable", "nonce") -> "Slash command is not available for command nonce"
     */
    constructor(error: "slash_command_unavailable", command: string);

    /**
     * 11
     * show error when public user tries to use a private command
     * @example new ErrorValidation("command_is_private") -> "This command is only available for private members!"
     */
    constructor(error: "command_is_private");

    /**
     * 12
     * show error whenever a user's sender can't be verified
     * @example new ErrorValidation("command_user_not_found") -> "Cannot verify the sender of this command!"
     */
    constructor(error: "command_user_not_found");

    /**
     * 13
     * show error when a user tries to use something that is not found
     * @param name the name of the thing that is not found
     * @example new ErrorValidation("something_not_found", "User") -> "User not found"
     */
    constructor(error: "something_not_found", name: string);

    /**
     * 14
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