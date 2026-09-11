import { supabaseModels } from "@shared/supabase";
import { Stoodie, stoodieCreate, StoodieCreate, stoodieUpdate, StoodieUpdate } from "@services/supabase/types";
import { FileUpload } from "@library";

export const tableName = "stoodies";
export const bucketName = "stoodies";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

async function getStoodie(stoodie: Stoodie["stoodie"]): Promise<Stoodie>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("stoodie", stoodie)
        .single()
        .throwOnError();
        
    return data!;
}

export async function createStoodie(schema: StoodieCreate): Promise<Stoodie>{
    const parsed = stoodieCreate.parse(schema);

    let image: string | undefined = undefined;
    if(parsed.image)
        image = await fileUpload.uploadFile(parsed.image, {filename: parsed.stoodie.stoodie});
    
    const {data} = await supabaseModels
        .from(tableName)
        .insert({
            ...parsed.stoodie,
            image
        })
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateStoodie(
    stoodie: Stoodie["stoodie"], 
    schema: StoodieUpdate, 
): Promise<Stoodie>{
    const parsed = stoodieUpdate.parse(schema);

    const get = await getStoodie(stoodie);

    let image: string | null | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.image)
            await fileUpload.removeFile(get.image)

        image = parsed.image ? await fileUpload.uploadFile(parsed.image, {filename: stoodie}) : null;
    }

    const {data} = await supabaseModels
        .from(tableName)
        .update({
            ...parsed.stoodie,
            image
        })
        .eq("stoodie", stoodie)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteStoodie(stoodie: Stoodie["stoodie"]): Promise<true>{
    const get = await getStoodie(stoodie);

    if(get.image)
        fileUpload.removeFile(get.image);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("stoodie", stoodie)
        .throwOnError();

    return true;
}