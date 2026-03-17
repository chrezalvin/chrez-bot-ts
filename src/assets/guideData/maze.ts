import { EmbedData } from "discord.js";

export const mazeData: EmbedData[] = [
    {
        title: "Guild Maze",
        description: [
            "Guild maze is one of the features in guild, it is a tower consisting of 1000 floors. ",
            "Inside, theres mob and bosses and treasure chests which drop unique items.",
            "It unlocks when the guild reaches level 10 (along with guild bar) and can be accessed among all guild members. ",
            "The item drops from guild maze mostly used for changing appearance and refining.",
        ].join("\n"),
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/guild_maze_icon.png"
        }
    },
    {
        title: "Entering the Maze",
        description: "Member or party member can enter guild maze using `Transfer Device` at the basement or `Guild Maid` at Guild Bar",
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/means_of_entering_maze.png"
        },
        footer: {
            text: "Once you click one of these options, you'll see the guild maze UI and will be charged Energy every time you enter the maze."
        }
    },
    {
        title: "Guild Maze Energy",
        description: "The amount of Energy you use is the current floor you have reached with a maximum of 100 Energy per entry (so at floor 100+ you only consume 100 Energy).\nEnergy can be restored by these three options:",
        fields: [
            {
                name: "",
                value: [
                    "Time: regenerate 1% (rounded up rounded down) Energy per 3 minute",
                    "Mana: convert 100 mana per 1% Energy (rounded down, 10k mana needed from 0 to full, cannot exceed limit of Energy)",
                    "Mana Potion: fully replenish Energy, consume 1 Mana Potion per use",
                ].map(line => `\n- ${line}`).join("")
            },
            {
                name: "",
                value: "**Note: If you're in a party, only the leader's Energy being charged**"
            }
        ],
        footer: {
            text: "currently, it's unknown how to maximize your energy Limit"
        },
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/guild_maze_ui.jpg"
        }
    },
    {
        title: "Guild Maze Floors",
        description: "There are 1000 floor in guild maze, the maze theme changes every 300 floor",
        fields: [
            {
                name: "Floor 1 - 300: Normal Maze Area",
                value: "Description: Regular maze area, low quality drops, mobs and boss are weak, trap spawns rarely."
            },
            {
                name: "Floor 301 - 600: Staircase Maze Area",
                value: ""
            },
            {
                name: "Floor 601 - 900: Crystal Atlantis Area",
                value: "Description: Clear maze view, the only obstacles are small rocks resembling the path. High quality drops, mobs and bosses are strong, trap spawns frequently."
            },
            {
                name: "Floor 901 - 1000: Sky Maze Area",
                value: [
                    "Description: Consist of bridges and Gazebo floating on the sky. Highest quality drop, mobs and boss are hardcore, trap spawns in all floor.",
                    "***Note: all chest drop from this floor are guaranteed to be the hyper version of it**"
                ].join("\n")
            }
        ],
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/guild_maze_map_types_updated.png"
        },
        footer: {
            text: "1. Normal Maze | 2. Staircase Maze | 3. Crystal Atlantis | 4. Sky Maze"
        }
    },
    {
        title: "Special Floors",
        fields: [
            {
                name: "Boss Floor",
                value: "At the 100th floor (i.e: 100,200) you will need to defeat all the monsters. Consisting arena with miniboss, boss, and mobs"
            },
            {
                name: "Maze Treasury",
                value: [
                    "After the 100th floor you will enter the gate of treasury, consisting a room of 4 chests. It's a mark of the end of the guild maze.",
                    "After leaving it, you will enter the guild bar and need to spend more energy to continue the next guild maze.",
                    "***Note: you can't enter the same gate of treasury twice so it will just skipped when you redoing the same maze**"
                ].join("\n")
            },
            {
                name: "Notes:",
                value: [
                    "the personal checkpoint updates every 10 floor, you need to clear the 10th floor to update the checkpoint",
                    "once you clear the 100th floor and leave the gate of treasury, all guild member can access the 101st floor",
                    "at the end of the month, all progress will be reset back to floor 1",
                ].map(line => `\n- ${line}`).join("")
            }
        ],
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/maze_special_floors.png"
        },
        footer: {
            text: "1. Boss Floor | 2. Maze Treasury"
        }
    },
    {
        title: "Monsters in Guild Maze",
        description: "You might notice the monsters in guild maze doesn't have level at all. That's because the monsters in guild maze share the same level with the player. __So the lower your level when you enter, the lower the stats of the mob__. This is great because you can clear maze easier by using low level char but with good equipment.",
        fields: [
            {
                name: "Best Practice",
                value: "Always use low level character while doing maze"
            },
            {
                name: "",
                value: "The monster strength also weakened each day, making them the __strongest at the beginning of the month__ and their __weakest at the end of the month__.",
                inline: true
            }
        ]
    },
    {
        title: "Guild Points",
        description: [
            "Guild Maze is also another option to earn guild points",
            "Monster killed in guild maze = +1pts (max 100 per day)",
            "Enter guild maze = +1pts each energy consumed [pt leader only] (max 32,000 per day)",
        ].join("\n")
    },
    {
        title: "Drops",
        description: "The chest in Guild Maze have different drop depending on the day of the week. Here are the list of possible drop from opening chests in maze:",
        fields: [
            {
                name: "Equipment Refinement",
                value: [
                    "Magic Hammer",
                    "Anti Degradation",
                    "Refinement Powder",
                    "High-Purity Ore",
                ].map(line => `\n- ${line}`).join("")
            },
            {
                name: "Appearance",
                value: [
                    "Gender-Changing Stone",
                    "Tattered Catalog",
                ].map(line => `\n- ${line}`).join("")
            },
            {
                name: "Coloured Gem",
                value: [
                    "Obsidian",
                    "Pearl",
                    "Diamond",
                    "Moonstone",
                    "Sunstone",
                    "Ruby",
                    "Garnet",
                    "Aquamarine",
                    "Sapphire",
                    "Zircon",
                    "Topaz",
                    "Emerald",
                    "Onyx",
                    "Tourmaline",
                    "Rose Quartz",
                    "Amethyst",
                    "Beryl",
                    "Light Shard",
                    "Colored Shard",
                ].map(line => `\n- ${line}`).join("")
            },
            {
                name: "Misc",
                value: [
                    "Boss/miniboss crysta",
                    "Maze coin (Bronze/Silver/Gold)",
                    "Skill books (such as Book of Unarmed, etc) better chance at floor 900+",
                    "Maze Gem (100% drop rate not flat!)",
                    "Battle Gems such as super rare drop gem",
                ].map(line => `\n- ${line}`).join("")
            }
        ],
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/guild_maze_drop_table.png"
        },
        footer: {
            text: "The drop table for each day of the week"
        }
    },
    {
        title: "Guild Maze Strategy of Efficiency",
        description: "Most players want to go to floor 900+ ASAP to get high quality drop. Here are some rules/suggestions to finish maze quickly.",

        fields: [
            {
                name: "What you need:",
                value: [
                    "shukuchi: best travelling skill, doesn't use mp and can be used at any distance",
                    "light armor: for evasion, it can make you travel faster at long corridors (note to do this you must have at least 1 monster unkilled)",
                    "HP/ASPD buff: mostly you'll use auto attack to kill mobs. You can increase ASPD to kill faster",
                    "To activate shukuchi >24m simply hold the action button and click repeatedly using 2 fingers on the monster you want to target using monster lists.",
                ].map(line => `\n- ${line}`).join("")
            },
            {
                name: "Class: Katana",
                value: [
                    "Pros:",
                    "Auto attack paired with unsheatte makes it even stronger",
                    "Access to two handed + shukuchi buff which makes your auto attack very strong",
                    "Katana roll gives extra mobility",
                    "Simple auto attack which make killing faster",
                ].join("\n- ").concat("\n\n").concat(
                    [
                        "Cons: ",
                        "You need 100% crit and high w.atk ktn to make your auto attack strong",
                        "Unsheatte gears are expensive",
                        "Not having area damage skill means you have to kill one-by-one",
                    ].join("\n- ")
                )
            },
            {
                name: "Class: Bowgun",
                value: [
                    "Pros:",
                    "Have a very good mobility skill with Twin Storm",
                    "Have good area damage with Crossfire",
                ].join("\n- ").concat("\n\n").concat(
                    [
                        "Cons: ",
                        "The AOE skills are relatively small, so it's not good for later floor where many mobs spawn in one room",
                    ].join("\n- ")
                )
            },
            {
                name: "Class: Mage",
                value: [
                    "Pros:",
                    "Have good area damage with Storm and Blizzard",
                    "Can use Float Dash, which is a good mobility skill",
                ].join("\n- ").concat("\n\n").concat(
                    [
                        "Cons: ",
                        "Although the AOE is great, the damage is not that good"
                    ].join("\n- ")
                ),
            }
        ],
        footer: {
            text: "Tips: never use any ranged class because you need to run to reach the checkpoint, making your progress slower."
        }
    },
    {
        title: "Party Up!",
        description: [
            "More players gives you more benefits such as clearing the maze faster or finding chests easier (or atleast make maze run less boring).",
            "There are new features unlocked when you're partying which is ghost member.",
            "the maximum amount of pt member is 4 (with leader)",
            "only the party leader can change floor so you need to wait for party leader to come to the checkpoint",
            "the monster level for party is the average of all party member level"
        ].map(line => `\n- ${line}`).join(""),
        fields: [
            {
                name: "Ghost Member",
                value: [
                    "Ghost member is a party member who died during the maze run. They cannot fight or open chests, but they have access to full map view and breaking traps.",
                    "They also can still get the drops from mobs killed and chests. They are great for finding path and chests, also help party member so they can avoid trap.",
                ].join("\n")
            }
        ]
    },
    {
        title: "Maze Traps",
        description: [
            "Traps are placed in random locations on the map. The more you ascend, the more traps you encounter.",
            "Traps can only be visible by ghost members. The light indicates the presence of a trap. ",
            "Ghost members can break traps, so alive party members won't step on it.",
            "When trap activated, everyone near the radius on trap receives damage. Enemies will also come in around 12m radius around the trap. ",
            "The damage from traps are fractionals calculated by your current HP (you won't die from trap):",
        ].join("\n\n"),
        fields: [
            {
                name: "Trap Damage",
                value: [
                    "**Jump trap** -> 0% fractional",
                    "**Rockfall trap** -> 20% fractional",
                    "**Needle trap** -> 20% fractional",
                    "**Explosion trap**-> 40% fractional",
                ].map(line => `\n- ${line}`).join("")
            }
        ],
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/maze/maze_trap_icon.png"
        }
    }
];

export default mazeData;