// this is the chrezcommand for weird words

import { CommandBuilder } from "@library/CommandBuilder";
import { rngInt } from "@library/basicFunctions";

import weirdList from "@assets/messages/active/weird.json";

const hello = new CommandBuilder<undefined>()
    .setName("weird")
    .setAlias(["fuck", "sex", "hooha", "bitch", "seizure", "slut", "bitch", "asshole", "shit", "ml"])
    .setDescription("Asks if you're okay?")
    .setStatus("hidden")
    .setChat({
        execute: async (message) => {
            const weird = weirdList[rngInt(0, weirdList.length - 1)];
            await message.channel.send(weird);
        },
    });

export default hello;