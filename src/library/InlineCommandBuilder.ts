import { Message } from "discord.js";

export interface CommandData{
    name: string;
    searchCriteria: (string | RegExp | ((message: Message<boolean>) => boolean))[];
    description: string;
}

export class InlineCommandBuilder implements CommandData{
    /**
     * Typeguard for CommandBuilder
     */
    public static isCommandBuilder(object: unknown): object is InlineCommandBuilder{
        return object instanceof InlineCommandBuilder;
    }

    protected m_name: CommandData["name"] = "";
    protected m_searchCriteria: CommandData["searchCriteria"] = [];
    protected m_description: CommandData["description"] = "";

    constructor(
        data?: Partial<CommandData>
    ){
        if(data){
            this.setName(data.name ?? "");
            this.setSearchCriteria(data.searchCriteria ?? []);
            this.setDescription(data.description ?? "");
        }
    }

    // getters
    /**
     * get command name
     */
    get name(){ return this.m_name; }

    /**
     * command searchCriterias
     */
    get searchCriteria(){ return this.m_searchCriteria; }

    /**
     * command description
     */
    get description(){ return this.m_description; }

    // setters
    /**
     * sets a new command name (will be changed to lowercase)
     * @param newName new command name
     * @returns this
     */
    setName(newName: string){
        this.m_name = newName.toLowerCase();

        return this;
    }

    /**
     * sets a new command description
     * @param description command description
     * @returns this
     */
    setDescription(description: string){
        this.m_description = description;

        return this;
    }

    /**
     * adds array of searchCriterias to the command
     * @param searchCriterias array of new searchCriterias
     * @returns this
     */
    setSearchCriteria(searchCriteria: CommandData["searchCriteria"]){
        this.m_searchCriteria = searchCriteria;

        return this;
    }

    /**
     * checks if the string given is the command name or searchCriterias
     * @param commandName a string command or searchCriterias
     * @returns true or false if the commandName is the command name or searchCriterias of this command
     */
    checkIfCommand(commandName: string | Message<boolean>){        
        return this.searchCriteria.find( criteria => {
            if(typeof commandName === "string"){
                if(typeof criteria === "string")
                    return commandName === criteria;
                if(typeof criteria !== "function")
                    return criteria.test(commandName);
            }
            else if(typeof criteria === "function")
                return criteria(commandName);


        })
    }
}