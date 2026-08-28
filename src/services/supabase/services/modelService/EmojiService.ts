import { supabaseModels } from "@shared/supabase";
import { Emoji, emojiCreate, EmojiCreate, emojiUpdate, EmojiUpdate } from "../../types/models/Emoji";
import { FileUpload } from "@library";

export const tableName = "emojis";
export const bucketName = "emojis";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

async function getEmoji(emoji: Emoji["emoji"]): Promise<Emoji>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("emoji", emoji)
        .single()
        .throwOnError();
        
    return data!;
}

export async function createEmoji(schema: EmojiCreate): Promise<Emoji>{
    const parsed = emojiCreate.parse(schema);
    
    const {data} = await supabaseModels
        .from(tableName)
        .insert({
            ...parsed.emoji,
            image: await fileUpload.uploadFile(parsed.image, parsed.emoji.emoji)
        })
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateEmoji(
    emoji: Emoji["emoji"], 
    schema: EmojiUpdate, 
): Promise<Emoji>{
    const parsed = emojiUpdate.parse(schema);

    const get = await getEmoji(emoji);

    let image: string | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.image)
            await fileUpload.removeFile(get.image)

        image = await fileUpload.uploadFile(parsed.image, emoji);
    }

    const {data} = await supabaseModels
        .from(tableName)
        .update({
            ...parsed.emoji,
            image
        })
        .eq("emoji", emoji)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteEmoji(emoji: Emoji["emoji"]): Promise<true>{
    const get = await getEmoji(emoji);

    if(get.image)
        fileUpload.removeFile(get.image);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("emoji", emoji)
        .throwOnError();

    return true;
}