import { BOT_OWNER_ID } from "@config";
import {InlineCommandReturnTypes, MyEmbedBuilder} from "@library";
import emojiList from "@assets/data/emojiList.json";

const command: InlineCommandReturnTypes = {
    name: "reprint",
    description: "Reprints a message with custom emoji",
    searchCriteria: [],
    execute: async (message) => {
        // // check if message came from owner
        // if(message.author.id !== BOT_OWNER_ID)
        //     return;

        // // check if message can be deleted
        // if(!message.deletable)
        //     return;

        // const embed = new MyEmbedBuilder();

        // embed.setAuthor({
        //     name: message.author.displayName,
        //     iconURL: message.author.displayAvatarURL(),
        // })

        // const emojiRegex = /:(\w{2,30}):/g;

        // let flagFound = false;
        // const emojiMessage = message.content.replace(emojiRegex, (match, emojiName) => {
        //     const emojiData = emojiList.find(emoji => emoji.name === emojiName || (emoji.alias && emoji.alias.includes(emojiName)));

        //     if(emojiData){
        //         flagFound = true;                
        //         return `<:${emojiData.name}:${emojiData.id}>`;
        //     }
                
        //     return match;
        // })

        // if(!flagFound)
        //     return;

        // embed.setDescription(emojiMessage);

        // message.delete()

        // message.channel.send({ embeds: [embed] });
    },
};

export default command;