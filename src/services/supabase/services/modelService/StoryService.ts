import { supabaseModels } from "@shared/supabase";
import { Story, StoryCreate, StoryUpdate } from "../../types/models/Story";

export const tableName = "stories";

export async function createStory(schema: StoryCreate): Promise<Story>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateStory(
    story: Story["story_id"], 
    schema: StoryUpdate, 
): Promise<Story>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("story_id", story)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteStory(
    story: Story["story_id"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("story_id", story)
        .throwOnError();

    return true;
}