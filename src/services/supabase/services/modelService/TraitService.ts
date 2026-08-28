import { supabaseModels } from "@shared/supabase";
import { Trait, TraitCreate, TraitUpdate } from "../../types/models/Trait";

export const tableName = "traits";

export async function createTrait(schema: TraitCreate): Promise<Trait>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateTrait(
    trait: Trait["trait"], 
    schema: TraitUpdate, 
): Promise<Trait>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
        .eq("trait", trait)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteTrait(
    trait: Trait["trait"]
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("trait", trait)
        .throwOnError();

    return true;
}