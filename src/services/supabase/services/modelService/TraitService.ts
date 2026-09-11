import { supabaseModels } from "@shared/supabase";
import { Trait, traitCreate, TraitCreate, traitUpdate, TraitUpdate } from "@services/supabase/types";

export const tableName = "traits";

export async function createTrait(schema: TraitCreate): Promise<Trait>{
    const parsed = traitCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateTrait(
    trait: Trait["trait"], 
    schema: TraitUpdate, 
): Promise<Trait>{
    const parsed = traitUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
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