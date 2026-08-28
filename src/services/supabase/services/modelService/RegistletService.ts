import { supabaseModels } from "@shared/supabase";
import { Registlet, registletCreate, RegistletCreate, registletUpdate, RegistletUpdate } from "../../types/models/Registlet";
import { FileUpload } from "@library";

export const tableName = "registlets";
export const bucketName = "registlets";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

async function getRegistlet(registlet: Registlet["registlet"]): Promise<Registlet>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("registlet", registlet)
        .single()
        .throwOnError();
        
    return data!;
}

export async function createRegistlet(schema: RegistletCreate): Promise<Registlet>{
    const parsed = registletCreate.parse(schema);

    let image: string | undefined = undefined;
    if(parsed.image)
        image = await fileUpload.uploadFile(parsed.image, parsed.registlet.registlet);
    
    const {data} = await supabaseModels
        .from(tableName)
        .insert({
            ...parsed.registlet,
            image
        })
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

    const get = await getRegistlet(registlet);

    let image: string | null | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.image)
            await fileUpload.removeFile(get.image)

        image = parsed.image ? await fileUpload.uploadFile(parsed.image, registlet) : null;
    }

    const {data} = await supabaseModels
        .from(tableName)
        .update({
            ...parsed.registlet,
            image
        })
        .eq("registlet", registlet)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteRegistlet(registlet: Registlet["registlet"]): Promise<true>{
    const get = await getRegistlet(registlet);

    if(get.image)
        fileUpload.removeFile(get.image);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("registlet", registlet)
        .throwOnError();

    return true;
}