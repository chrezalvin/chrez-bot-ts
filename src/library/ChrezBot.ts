import {Client, Interaction, Message} from "discord.js";

interface ChrezBotRequest{
    message?: Message<boolean>;
    interaction?: Interaction;
}

interface ChrezBotResponse{
    send: (message: string) => void;
}

class ChrezBotMiddleware{
    public req: ChrezBotRequest = {
    };

    public res: ChrezBotResponse = {
        send: (message: string) => {}
    }

    public next: () => void  = () => {

    }
}

class ChrezBot {
    private m_discordClient: Client;
    private m_chrezBotMiddlewares: ChrezBotMiddleware[] = [];

    constructor(){
        this.m_discordClient = new Client({
            intents: [

            ]
        });

        this.m_discordClient.on("messageCreate", (message: Message<boolean>) => {

        })
    }

    private startChain(){
        let index = 0;
        let middleware = this.m_chrezBotMiddlewares[index];

        
    }

    use(): ChrezBot{


        return this;
    }
}