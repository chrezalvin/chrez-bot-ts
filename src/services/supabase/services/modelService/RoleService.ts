import { supabaseModels } from "@shared/supabase";
import { Role, roleCreate, RoleCreate, roleUpdate, RoleUpdate } from "@services/supabase/types";

export const tableName = "roles";

export async function createRole(schema: RoleCreate): Promise<Role>{
    const parsed = roleCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateRole(
    role: Role["role"], 
    schema: RoleUpdate, 
): Promise<Role>{
    const parsed = roleUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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