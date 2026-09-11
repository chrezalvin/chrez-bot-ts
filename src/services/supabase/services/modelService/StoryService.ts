import { supabaseModels } from "@shared/supabase";
import { Story, storyCreate, StoryCreate, storyUpdate, StoryUpdate } from "@services/supabase/types";

export const tableName = "stories";

export async function createStory(schema: StoryCreate): Promise<Story>{
    const parsed = storyCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateStory(
    story: Story["story_id"], 
    schema: StoryUpdate, 
): Promise<Story>{
    const parsed = storyUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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