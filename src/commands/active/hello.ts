import { CommandBuilder } from "@library/CommandBuilder";

const hello = new CommandBuilder<undefined>()
    .setName("hello")
    .setDescription("Says hello")
    .setStatus("public")
    .setMode("available")
    .setSlash({
        interact: async (interaction) => {
            await interaction.reply(`Hello, ${interaction.member?.user.username}!`);
        },
    })
    .setChat({
        execute: async (message) => {
            await message.channel.send("hi");
        },
    });

export default hello;