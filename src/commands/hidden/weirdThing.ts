// this is the chrezcommand for weird words

import { CommandBuilder, rngInt } from "@library";

import weirdList from "@assets/messages/active/weird.json";

const hello = new CommandBuilder<undefined>()
    .setName("weird")
    .setAlias(["fuck", "sex", "hooha", "bitch", "seizure", "slut", "asshole", "shit", "ml"])
    .setDescription("Asks if you're okay?")
    .setStatus("hidden")
    .setChat({
        execute: async (message) => {
            const weird = weirdList[rngInt(0, weirdList.length - 1)];
            await message.channel.send(weird);
        },
    });

export default hello;