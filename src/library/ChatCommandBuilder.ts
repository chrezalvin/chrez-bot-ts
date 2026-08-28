export interface ExampleField{
    command: string;
    description?: string;
}

export interface CommandData{
    name: string;
    alias: string[]; 
    description: string;
    examples: ExampleField[];
}

export class ChatCommandBuilder implements CommandData{
    /**
     * Typeguard for CommandBuilder
     */
    public static isCommandBuilder(object: unknown): object is ChatCommandBuilder{
        return object instanceof ChatCommandBuilder;
    }

    protected m_name: CommandData["name"] = "";
    protected m_alias: CommandData["alias"] = [];
    protected m_description: CommandData["description"] = "";

    public examples: ExampleField[] = [];

    constructor(
        data?: Partial<CommandData>
    ){
        if(data){
            this.setName(data.name ?? "");
            this.setAlias(data.alias ?? []);
            this.setDescription(data.description ?? "");

            this.examples = data.examples ?? [];
        }
    }

    // getters
    /**
     * get command name
     */
    get name(){ return this.m_name; }

    /**
     * command aliases
     */
    get alias(){ return this.m_alias; }

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
     * replaces the examples with a new one
     * @param examples array of new example data
     */
    setExamples(examples: ExampleField[]){
        this.examples = examples;

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
     * adds array of aliases to the command
     * @param aliases array of new aliases
     * @returns this
     */
    setAlias(aliases: string[]){
        for(const ali of aliases){
            this.addAlias(ali);
        }

        return this;
    }

    /**
     * add a new alias to the command
     * @param alias new alias
     */
    addAlias(alias: string){
        alias = alias.toLowerCase();

        if(this.m_alias.find((x) => x === alias))
            console.log(`Alias ${alias} already exist, skipping alias creation`);
        else
            this.m_alias.push(alias);

        return this;
    }

    /**
     * remove an alias from the command
     * @param alias alias to be removed
     */
    removeAlias(alias: string | number){
        if(typeof alias === "number"){
            if(this.m_alias.length < alias && alias >= 0)
                throw new Error(`Alias index out of bounds, please choose between 0 to ${this.m_alias.length - 1}`);

            this.m_alias = this.m_alias.filter((_, index) => index !== alias);
        }
        else{
            this.m_alias = this.m_alias.filter((x) => x !== alias);
        }

        return this;
    }

    /**
     * checks if the string given is the command name or alias
     * @param commandName a string command or alias
     * @returns true or false if the commandName is the command name or alias of this command
     */
    checkIfCommand(commandName: string){
        return this.m_name === commandName || this.m_alias.find((x) => x === commandName) !== undefined;
    }
}