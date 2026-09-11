import { supabaseModels } from "@shared/supabase";
import { ElementWeakness, elementWeaknessCreate, ElementWeaknessCreate } from "@services/supabase/types";

export const tableName = "element_weakness";

export async function createElementWeakness(schema: ElementWeaknessCreate): Promise<ElementWeakness>{
    const parsed = elementWeaknessCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteElementWeakness(
    elementWeakness: {
        element: ElementWeakness["element"],
        weakness: ElementWeakness["weakness"]
    }
): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("element", elementWeakness.element)
        .eq("weakness", elementWeakness.weakness)
        .throwOnError();

    return true;
}