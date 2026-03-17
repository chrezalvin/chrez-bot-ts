import { EmbedData } from "discord.js";

export const refiningData: EmbedData[] = [
    {
        title: "Refinement System Adjustment (13th May 2022)",
        fields: [
            {
                name: "Introducing: refine point",
                value: [
                    "When refining, each refine give refine point according to the ore you use (better ore = more point)",
                    "Success rate increase by 1% [flat increase] each 150 point (e.g: at 450 pts = 3% inc, 500 pts = still 3% [rounded down])",
                    "Point can be accumulated infinitely"
                ].map(line => `\n- ${line}`).join("")
            }
        ]
    },
    {
        title: "Refining Point Detail",
        description: "Here's how you can check refine point in the equipment, this works on all refinable equipment and will start from 0 (+0% boost)",
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/refining/refine_point_detail.jpg"
        }
    },
    {
        title: "Point Gain per Ore",
        description: "Here's how much point you can get per refine with each ore",
        image: {
            url: "https://iyiagjaadfnwvixxthwl.supabase.co/storage/v1/object/public/images/guides/refining/point_gain_per_ore.jpg"
        },
        footer: {
            text: "*Notice that upgraded ore (like iron or mithril) give x2 point of base ore, and high-purity version give x6 point of base ore"
        }
    },
    {
        title: "Efficient Refine Guide (+0 -> +S)",
        fields: [
            {
                name: "Note for this refine:",
                value: [
                    "this refine uses only mithril ore, tho you can use better ore to make it faster but it's more expensive",
                    "you need `TEC` and `LUK` refiner for this refine, `LUK` only need lv1 refine skill",
                    "you'd need atleast 3 stk of mithril ore depending on your luck",
                    "not recommended for 2s because of its degradation chance (use andeg with `LUK` refiner for this)",
                ].map(line => `\n- ${line}`).join("")
            },
            {
                name: "Steps",
                value: [
                    "Keep using `TEC` until you hit `+D` or `+C`",
                    "Switch to `LUK` and if it degrades to `+E`, switch to `TEC` again",
                    "Keep repeating this proccess until you reach `+S` (should be around 1.2k ref pts) ",
                ].map(line => `\n- ${line}`).join("")
            }
        ]

    }
]

export default refiningData;