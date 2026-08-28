import { supabaseModels } from "@shared/supabase";
import { Role, RoleCreate, RoleUpdate } from "../../types/models/Role";

export const tableName = "roles";

export async function createRole(schema: RoleCreate): Promise<Role>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateRole(
    role: Role["role"], 
    schema: RoleUpdate, 
): Promise<Role>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("role", role)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteRole(
    role: Role["role"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("role", role)
        .throwOnError();

    return true;
}