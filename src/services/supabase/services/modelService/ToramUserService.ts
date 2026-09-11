import { supabaseModels } from "@shared/supabase";
import { ToramUser, toramUserCreate, ToramUserCreate, toramUserUpdate, ToramUserUpdate } from "@services/supabase/types";

export const tableName = "toram_users";

export async function createToramUser(schema: ToramUserCreate): Promise<ToramUser>{
    const parsed = toramUserCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateToramUser(
    toramUser: ToramUser["toram_user"], 
    schema: ToramUserUpdate, 
): Promise<ToramUser>{
    const parsed = toramUserUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
        .eq("toram_user", toramUser)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteToramUser(
    toramUser: ToramUser["toram_user"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("toram_user", toramUser)
        .throwOnError();

    return true;
}