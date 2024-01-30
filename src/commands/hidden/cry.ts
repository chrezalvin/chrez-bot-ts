import { CommandBuilder } from "@library/CommandBuilder";
import { rngInt } from "@library/basicFunctions";
import cryList from "@assets/messages/active/cry.json";

const hello = new CommandBuilder<undefined>()
    .setName("cry")
    .setAlias(["cries", "crys"])
    .setDescription("Cries to chat")
    .setStatus("hidden")
    .setChat({
        execute: async (message) => {
            const cry = cryList[rngInt(0, cryList.length - 1)];
            await message.channel.send(cry);
        },
    });

export default hello;