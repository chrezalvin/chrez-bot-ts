// import { Client, Interaction, Message, TextBasedChannel } from "discord.js";

// export interface ChrezBotCommandRequest{
//     client: Client;
//     args: any[];
// }

// export interface ChrezBotCommandResponse{
//     client: Client<true>;
//     channel: TextBasedChannel;
// }

// export interface ChrezBotInteractionRequest{
//     client: Client;
// }

// export interface ChrezBotInteractionResponse{
//     interaction: Interaction;
// }

// export type ChrezBotCommandHandler = (req: ChrezBotCommandRequest, res: ChrezBotCommandResponse, next: any) => void;
// export type ChrezBotInteractionHandler = (req: ChrezBotInteractionRequest, res: ChrezBotInteractionResponse, next: any) => void;

// /**
//  * Custom discord bot class inspired by express.js
//  */
// export class ChrezBot{
//     private m_client: Client;
//     private m_prefix: string = "Chrez";
//     private m_aliases: string[] = [];

//     private m_handlers: ChrezBotCommandHandler[] = [];
//     private m_commands: Map<string, ChrezBotCommandHandler> = new Map();
//     private m_commands_interaction: Map<string, ChrezBotCommandHandler> = new Map();

//     // getters
//     /**
//      * discord bot client
//      */
//     public get client(): Client{
//         return this.m_client;
//     }

//     /**
//      * bot prefix, normal message needs to start with this prefix to be considered as a command
//      */
//     public get prefix(): string{
//         return this.m_prefix;
//     }

//     // setter
//     public set prefix(prefix: string){
//         this.m_prefix = prefix;
//     }

//     public addAlias(alias: string){
//         // make sure no duplicate alias
//         if(this.m_aliases.includes(alias)) return;

//         this.m_aliases.push(alias);
//     }

//     constructor(
//         client: Client, 
//         options?: {prefix?: string, aliases?: string[]}
//     ){
//         this.m_client = client;
//         if(options?.prefix)
//             this.m_prefix = options.prefix;
//         if(options?.aliases)
//             this.m_aliases = options.aliases;

//         client.on("messageCreate", (message) => {
//             // check if message starts with prefix or its aliases
//             if(!message.content.startsWith(this.m_prefix) && !this.m_aliases.some(alias => message.content.startsWith(alias))) return;

//             const args = message.content.trim().split(/ +/);

//             // remove prefix from command
//             args.shift();

//             // first argument is the command
//             const command = args.shift();

//             this.handleCommandRequest(command || "", message, ...args);
//         });

//         client.on("interactionCreate", (interaction) => {
//             if(!interaction.isCommand()) return;

//             const command = interaction.commandName;

//             this.handleInteractionRequest(command, interaction);
//         });
//     }

//     private handleInteractionRequest(command: string, interaction: Interaction){
//         const stack: ChrezBotCommandHandler[] = [...this.m_handlers];
//         const handler = this.m_commands_interaction.get(command);

//         if(handler){
//             stack.push((req: ChrezBotCommandRequest, res: ChrezBotCommandResponse, next: any) => {
//                 handler(req, res, next);

//                 next();
//             });
//         }

//         this.executeInteractionRequest([], stack, interaction);
//     }

//     private executeInteractionRequest(args: any[], stack: ChrezBotCommandHandler[], interaction: Interaction){
//         const next = () => {
//             if(stack.length === 0) return;

//             const middleware = stack.shift();
//             if(middleware === undefined) return;

//             middleware({
//                 client: this.m_client,
//                 args: args,
//             }, {
//                 client: interaction.client,
//             }, next);
//         }

//         next();
//     }

//     private handleCommandRequest(command: string, message: Message<boolean>, ...args: any[]){
//         const stack: ChrezBotCommandHandler[] = [...this.m_handlers];
//         const handler = this.m_commands.get(command);

//         if(handler){
//             stack.push((req: ChrezBotCommandRequest, res: ChrezBotCommandResponse, next: any) => {
//                 handler(req, res, next);

//                 next();
//             });
//         }

//         this.executeCommandRequest(args, stack, message);
//     }

//     private executeCommandRequest(args: any[], stack: ChrezBotCommandHandler[], message: Message<boolean>){
//         const next = () => {
//             if(stack.length === 0) return;

//             const middleware = stack.shift();
//             if(middleware === undefined) return;

//             middleware({
//                 client: this.m_client,
//                 args: args,
//             }, {
//                 client: message.client,
//                 channel: message.channel,
//             }, next);
//         }

//         next();
//     }
    
//     public use(handler: ChrezBotCommandHandler){
//         this.m_handlers.push(handler);
//     }

//     public command(command: string, handler: ChrezBotCommandHandler){
//         this.m_commands.set(command, handler);
//     }

//     // public interact(command: string, handler: ChrezBotHandler){
//     //     this.use((req, res, next) => {
//     //         if(req.client === this.m_client)
//     //             handler(req, res, next);
//     //         else
//     //             next();
//     //     });
//     // }
// }