import { EmbedData } from "discord.js";

export const traitData: EmbedData[] = [
    {
        title: "What are Traits?",
        description: "Traits are a special ability that you can attach to your armor and weapons. They're mostly consisted of small boosts and can get from `Tier 1` to `Tier 5`. A Trait's effect can be checked from NPC blacksmith. You can differentiate the tier from color as shown below:"
            .concat([
                "`Tier 1`: :white_circle:",
                "`Tier 2`: :green_circle:",
                "`Tier 3`: :blue_circle:",
                "`Tier 4`: :purple_circle:",
                "`Tier 5`: :yellow_circle:",
            ].map(ele => "\n- " + ele).join("")),
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/trait_details_thumbnail.png",
        },
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/trait_icon.png"
        },
        footer: {
            text: "A tier 3 Trait icon and their details"
        }
    },
    {
        title: "Obtaining Traits",
        description: "Traits can be obtained randomly from **monster's drop**, **quest's reward**, and **equipment from chests** (such as red steel box), they **cannot be obtained through crafting**. A specific Trait tier can only be obtained on specific conditions:",
        fields: [
            {
                name: "Drop from Chests, Quests, and Exchanges",
                value: "May drop up to `Tier 4` depending on the equipment obtained"
            },
            {
                name: "Regular Monster Drop",
                value: [
                    "`Tier 1 - 3`: obtained from mob lvl 1+",
                    "`Tier 4`: obtained from mob above lvl 100"
                ].map(ele => "\n- " + ele).join("")
            },
            {
                name: "Boss Monster Drop",
                value: [
                    "**Easy**: Only `Tier 1`",
                    "**Normal**: Up to `Tier 2`",
                    "**Hard**: Up to `Tier 3`",
                    "**Nightmare**: `Tier 4` included for boss over lvl100",
                    "**Ultimate**: `Tier 5` included for boss over lvl200",
                ].map(ele => "\n- " + ele).join("")

            }
        ],
        footer: {
            text: "Note: if you have any active 30-Day Ticket (Bag Expansion/Standard Ticket/Leveling Ticket), any equipment drop with Trait Tier 3 or higher will become tradeable."
        }
    },
    {
        title: "Trait Transfer",
        description: "You can use spina to transfer a Trait from one equipment to another. You can transfer Trait from NPC blacksmith at `NPC > [Customize Equipment] > [Trait Transfer]`.",
        fields: [
            {
                name: "Success Rate of Trait Transfer",
                value: [
                    "Same Item equipment: 100% chance (e.g: `10th Anniversary Staff VI` -> `10th Anniversary Staff VI`)",
                    "Different Item: 10% chance (e.g: `10th Anniversary Staff V` -> `10th Anniversary Staff VI`)",
                    "Different equipment types: Not possible (e.g: Sword -> Staff)",
                ].map(ele => "\n- " + ele).join("")
            },
            {
                name: "",
                value: "Unlike synthesist, **both equipment won't be lost** after transfer, only the traits are affected. A successful Trait transfer will remove the Trait from source equipment to the target equipment. Meanwhile, A failed Trait transfer will destroy the Trait from source equipment adds `Radiant Chance` Trait to the target equipment. Any existing Trait on the target equipment will be replaced by the transferred Trait.",
                inline: true
            }
        ],
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/trait_transfer_icon.png"
        }
    },
    {
        title: "`Radiant Chance` Trait",
        description: "`Radiant Chance` is an exclusive Trait that appears when a Trait transfer fails:",
        fields: [
            {
                name: "Radiant Chance",
                value: "```The success rate of Trait Transfer increases by 10% * Radiance Chance Level. Changes to \"Radiant Chance Lv+1\" upon failure. Max Level: Level 9.```"
            },
            {
                name: "",
                value: [
                    "When a Trait transfer fail, `Radiant Chance lv1` is added to the target equipment",
                    "`Radiant Chance` can be transferred to another equipment",
                    "If transferring `Radiant Chance` fails, the level will drop to 1",
                    "When both equipment have `Radiant Chance`:",
                ].map(ele => "\n- " + ele).join("")
                .concat(
                    [
                        "The success rate to transfer is combined (e.g: `Radiant lv3` -> `Radiant lv2` = 30% + 20% + 10% (from base) = 60% success chance)",
                        "Successful transfer will transfer `Radiant Chance` from source to target equipment, while Failed transfer will increase `Radiant Chance` level (whichever is higher) by 1.",
                    ].map(ele => "\n   - " + ele).join("")
                ),
                inline: true
            }
        ],
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/radiant_chance_transfer_example.png"
        }
    },
    {
        title: "Using Magic Hammer",
        description: "Magic Hammer can be used to intentionally reduce the success rate of Trait transfer (up to 0%) to raise `Radiant Chance` level. Multiple magic hammers can be used to stack the reduction effect. Higher grade Magic Hammer allows greater increase of `Radiant Chance` levels.\n\nWhen transferring Trait with Magic Hammer of different grades, the level increase will be random between the lowest and highest values of hammer used (e.g: 1 Magic Hammer + 1 Super Magic Hammer = increase `Radiant Chance` level by 1 or 2 if fail)",
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/success_rate_decrease_using_magic_hammer.png"
        }
    },
    {
        title: "Trait Transfer Cost",
        description: "```=(INT(MAX(0;(INT(Target Equipment * Equipment Fee/10000) - INT(Source Equipment * Equipment Fee/10000)))^2/100) + 100) * 100 * (Trait Tier * (25 * Trait Tier - 25) + 100) * 0.01```",
        fields: [
            {
                name: "Base Transfer Equipment Fee",
                value: "```" + [
                    "OHS:   10,000", 
                    "THS:   6,670" ,
                    "BOW:   16,670", 
                    "BWG:   12,500", 
                    "STF:   10,000", 
                    "MD:    20,000", 
                    "KN:    14,290", 
                    "HB:    6,250" ,
                    "KTN:   25,000", 
                    "Armor: 18,500",
                ].map(ele => "\n" + ele).join("") + "```"
            }
        ],
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/spina_icon_no_bg.PNG"
        }
    },
    {
        title: "Tips: Using Trait",
        description: [
            "You can\'t use traits from sub-weapon (e.g: Magic Device sub)",
            "Some Traits have common effects that are activated all the time; meanwhile, some others require you to meet a certain condition to activate the Trait effects.",
            "Trait with `Activation Power` requires you to meet the certain condition multiple times to enjoy the Trait effect. `Activation Power X%` = generates `X%` power every time the certain condition is met. The Trait activates when power reaches 100%, then saves residual power for next activation.",
            "Traits with `MISS` hit as an activation condition require a real `MISS` from not enough `HIT`, Critical, Graze gacha lose, etc (not from skill effect).",
            "You can stack the same Type/Tier Traits effect.",
        ].map(ele => "\n- " + ele).join(""),
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/trait_icon.png"
        }
    },
    {
        title: "Tips: Reducing Transfer Cost of `Radiant Chance Lv9` by Transfer Chaining",
        description: [
            "Since `Radiant Chance Lv9` always give 100% success rate, you can transfer chain the Trait step by step by using other weapon/armor that have higher and higher watk/def to reduce the cost of attaching at once. you can reduce about 70% of total cost this way.",
            "Note: This method only works for `Radiant Chance lv9`, it's risky to use it on another Trait"
        ].join("\n\n"),
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/trait_chaining.png"
        },
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/spina_icon_no_bg.PNG"
        }
    },
    {
        title: "Tips: Reducing Trait Transfer Cost with Failed Equipment",
        description: "Since Trait cost gets exponentially more expensive by the difference of source & target equipment. You can use a failed version of the target equipment to act as an intermediary to reduce the cost because failed version have lower atk/def and transfer to the same item is always 100% chance.",
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/broken_weapon_tips.png"
        },
        thumbnail: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/spina_icon_no_bg.PNG"
        }
    },
    {
        title: "Other Tips",
        description: [
            "You can change the Auto-Discard settings for items with a Trait from `[Settings] → [Auto-item]`.",
            "You can apply Trait filter on Consignment Board when you choose Weapons/Armor category.",
            "You can check the Trait list at https://discord.com/channels/739696962097512449/1483111298152796172",
        ].map(ele => "\n- " + ele).join("")
    }
];

export default traitData;