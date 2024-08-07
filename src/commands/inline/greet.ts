import {inlineCommandReturnTypes, MyEmbedBuilder, rngInt} from "@library";

import greet from "@assets/messages/inline/greet.json";
import { prefixes } from "@config";
import { UserService } from "@services";

const command: inlineCommandReturnTypes = {
    name: "greet",
    description: "Greet the user",
    searchCriteria: ["cheese", /^he+re+$/i, ...prefixes],
    execute: async (message) => {
        // exclusive for vice and owner only!
        const user = await UserService.getUser(message.author.id);
        if(user){
            if(user.rolename === "owner" || user.rolename === "vice"){
                message.channel.send(greet.exclusive[rngInt(0, greet.exclusive.length - 1)]
                    .replace("[name]", message.author.username)
                    .replace("[role]", user.rolename)
                    .replace("[alias]", user.aliases ? user.aliases[rngInt(0, user.aliases.length - 1)] : "")
                );
                return;
            }
        }

        const embed = new MyEmbedBuilder()
            // .setTitle(`Chrezbot greets ${message.author.username}`)
            // .setDescription(greet[rngInt(0, greet.length - 1)].replace("[name]", message.author.username));

        message.channel.send(greet.normal[rngInt(0, greet.normal.length - 1)].replace("[name]", message.author.username));
    },
};

export default command;