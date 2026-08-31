import { supabaseModels } from "@shared/supabase";
import { Registlet, registletCreate, RegistletCreate, registletUpdate, RegistletUpdate } from "../../types/models/Registlet";
import { FileUpload } from "@library";

export const tableName = "registlets";
export const bucketName = "registlets";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

export async function createRegistlet(schema: RegistletCreate): Promise<Registlet>{
    const parsed = registletCreate.parse(schema);
    
    const {data} = await supabaseModels
        .from(tableName)
        .insert(parsed)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateRegistlet(
    registlet: Registlet["registlet"], 
    schema: RegistletUpdate, 
): Promise<Registlet>{
    const parsed = registletUpdate.parse(schema);
    const {data} = await supabaseModels
        .from(tableName)
        .update(parsed)
        .eq("registlet", registlet)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteRegistlet(registlet: Registlet["registlet"]): Promise<true>{
    await supabaseModels
        .from(tableName)
        .delete()
        .eq("registlet", registlet)
        .throwOnError();

    return true;
}