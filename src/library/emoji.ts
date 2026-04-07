import emojiLookup from "@assets/data/emojiLookup.json";
import { MODE } from "@config";

export function getEmoji(emojiName: keyof typeof emojiLookup): string {
    return `<:${emojiName}:${MODE === "production" ? emojiLookup[emojiName].prod_id : emojiLookup[emojiName].dev_id}>`;
}