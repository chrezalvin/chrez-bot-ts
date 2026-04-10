import emojiLookup from "@assets/data/emojiLookup.json";
import { MODE } from "@config";

export function getEmoji(emojiName: keyof typeof emojiLookup): string {
    return `<:${emojiName}:${MODE === "production" ? emojiLookup[emojiName].prod_id : emojiLookup[emojiName].dev_id}>`;
}

// relaxed emoji lookup that also checks for aliases
export function getEmojiAlias(emojiName: string): string | null {
    const emojiEntry = emojiLookup[emojiName as keyof typeof emojiLookup];

    if(emojiEntry)
        return `<:${emojiName}:${MODE === "production" ? emojiEntry.prod_id : emojiEntry.dev_id}>`;

    // check for alias
    for(const key in emojiLookup){
        const entry = emojiLookup[key as keyof typeof emojiLookup];

        if("alias" in entry)
            for(const alias of entry.alias)
                if(alias === emojiName)
                    return `<:${key}:${MODE === "production" ? entry.prod_id : entry.dev_id}>`;
            
    }
    
    return null;
}