import { supabaseModels } from "@shared/supabase";
import { ToramUser, ToramUserCreate, ToramUserUpdate } from "../../types/models/ToramUser";

export const tableName = "toram_users";

export async function createToramUser(schema: ToramUserCreate): Promise<ToramUser>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateToramUser(
    toramUser: ToramUser["toram_user"], 
    schema: ToramUserUpdate, 
): Promise<ToramUser>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
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