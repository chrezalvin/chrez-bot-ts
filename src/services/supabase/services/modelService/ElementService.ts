import { supabaseModels } from "@shared/supabase";
import { Element, ElementCreate, ElementUpdate } from "../../types/models/Element";

export const tableName = "elements";

export async function createElement(schema: ElementCreate): Promise<Element>{
    const {data} = await supabaseModels
        .from(tableName)
        .insert(schema)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateElement(
    element: Element["element"], 
    schema: ElementUpdate, 
): Promise<Element>{
    const {data} = await supabaseModels
        .from(tableName)
        .update(schema)
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