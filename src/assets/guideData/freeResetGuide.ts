import { EmbedData } from "discord.js";

export const freeResetGuide: EmbedData[] = [
    {
        title: "About Free Reset",
        description: [
            "Free Reset is a campaign that allows you to reset your skill tree and stats for free. You'll be given points that you can use to reset, here's the detail",
            "-1pts to reset all skills",
            "-1pts to reset a specific skill tree",
            "-1pts to reset all stats (INT, STR, DEX, AGI, VIT)",
            "-1pts to remove personal stat (CRT, LUK, TEC, MTL)",
            "",
            "\\* During the campaign, it's free to buy and upgrade skill tree from library"
        ].join("\n"),
        thumbnail: {
            url: "https://toram-jp.akamaized.net/en/img/banner/toram_FreeSkilStatsReset_1200x600_en.png"
        }
    },
    {
        title: "Completing Skill Tree to get Free Skill Points",
        description: [
            "You can earn 3 emblems by completing the skill tree (All skills are lv10):",
            "<:emblem:1486606587236712529> **Skill Master**: Completed 1 skill tree",
            "<:emblem:1486606587236712529> **Versatile Ability**: Completed 2 skill trees at the same time",
            "<:emblem:1486606587236712529> **Godlike**: Completed 3 skill trees at the same time",
            "",
            "Here are some skill tree recommendation to complete:",
            "<:play_dead:1486606820591013968> **Survival Skills**: 90 Skill Points",
            "<:pet_cage:1498362360287465534> **Tamer Skills**: 70 Skill Points",
            "<:ninjutsu_scroll:1498363157897281587> **Ninja Skills**: 40 Skill Points",
            "<:heavy_armor_mastery:1486606672783999179> **Guard Skills**: 60 Skill Points",
        ].join("\n")
    },
    {
        title: "Blacksmith Crafter Skill Tree Rework",
        description: [
            "For old returning player that have blacksmith crafter, toram have reworked the blacksmith skill tree.",
            "Now the profiency cap scales with current level cap, and the skill tree that previously raises prof cap has turned into mats reduction for statter",
            "With that change, the blacksmith skill tree distribution for **all crafter** should be like below:",
            "\\*Note: Expert's Customization II is only useful for gamble statting",
        ].join("\n"),
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/skill_reset/crafter_bs_skilltree.png"
        }
    },
    {
        title: "Blacksmith Statter Skill Tree Rework",
        description: [
            "For old returning player that have blacksmith statter, toram have reworked the blacksmith skill tree.",
            "Now the profiency cap scales with current level cap, and the skill tree that previously raises prof cap has turned into mats reduction for statter",
            "With that change, the blacksmith skill tree distribution for **statter** should be like below:",
            "\\*Note: you can level up all compassion skills, but the priority order is as follows:",
            "1. Mana Compassion",
            "2. Metal Compassion",
            "3. Wood Compassion",
            "4. Everything else"
        ].join("\n"),
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/skill_reset/statter_bs_skilltree.png"
        }
    },
    {
        title: "Recommended Stargem",
        description: [
            "You can save skill points by using stargem, here are some recommended stargem"
        ].join("\n"),
        fields: [
            {
                name: "useful for all class",
                value: [
                    "<:first_aid:1486606623878152223> First Aid",
                    "<:play_dead:1486606820591013968> Play Dead",
                    "<:process_materials:1486606828874895531> Process Materials",
                    "<:quick_aura:1486606839151067186> Quick Aura",
                    "<:recovery:1486606845509501048> Recovery",
                    "<:smash:1486606916388917318> Smash",
                    "<:sonic_wave:1498374832851652699> Sonic Wave",
                    "<:bash:1486606474426847262> Bash"
                ].join("\n")
            },
            {
                name: "nice to have",
                value: [
                    "<:cast_mastery:1486606516885655726> Cast Mastery",
                    "<:protection:1486606830783430687> Protection",
                    "<:whack:1486607005488517140> Whack",
                    "<:concentrate:1486606534107725874> Concentrate",
                    "<:pet_cage:1498362360287465534> Taming",
                ].join("\n")
            }
        ],
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/skill_reset/star_gem.png"
        }
    }
];

export default freeResetGuide;