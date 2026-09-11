import { supabaseModels } from "@shared/supabase";
import { Element, elementCreate, ElementCreate, elementUpdate, ElementUpdate } from "@services/supabase/types";

export const tableName = "elements";

export async function createElement(schema: ElementCreate): Promise<Element>{
    const parsed = elementCreate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateElement(
    element: Element["element"], 
    schema: ElementUpdate, 
): Promise<Element>{
    const parsed = elementUpdate.parse(schema);

    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
        .eq("element", element)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteElement(element: Element["element"]): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("element", element)
        .throwOnError();

    return true;
}