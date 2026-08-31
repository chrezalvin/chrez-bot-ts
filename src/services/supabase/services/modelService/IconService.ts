import { supabaseModels } from "@shared/supabase";
import { Icon, iconCreate, IconCreate, iconUpdate, IconUpdate } from "../../types/models/Icon";
import { FileUpload } from "@library";
import { capitalize } from "@library/BasicFunctions";

export const tableName = "icons";
export const bucketName = "icons";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

async function getIcon(icon: Icon["icon"]): Promise<Icon>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("icon", icon)
        .single()
        .throwOnError();
        
    return data!;
}

export async function createIcon(schema: IconCreate): Promise<Icon>{
    const parsed = iconCreate.parse(schema);

    const newFileName = schema.icon.category + "_" + parsed.icon.icon;

    const {data} = await supabaseModels
        .from(tableName)
        .insert({
            ...parsed.icon,
            image: await fileUpload.uploadFile(parsed.image.file, {
                filename: newFileName,
                contentType: parsed.image.mimetype
            })
        })
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateIcon(
    icon: Icon["icon"], 
    schema: IconUpdate, 
): Promise<Icon>{
    const parsed = iconUpdate.parse(schema);

    const get = await getIcon(icon);

    const newFileName = (parsed.icon.category ?? get.category) + "_" + parsed.icon.icon;

    let image: string | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.image)
            await fileUpload.removeFile(get.image)

        image = await fileUpload.uploadFile(parsed.image.file, {
            filename: newFileName,
            contentType: parsed.image.mimetype
        });
    }

    const {data} = await supabaseModels
        .from(tableName)
        .update({
            ...parsed.icon,
            image
        })
        .eq("icon", icon)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteIcon(icon: Icon["icon"]): Promise<true>{
    const get = await getIcon(icon);

    if(get.image)
        fileUpload.removeFile(get.image);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("icon", icon)
        .throwOnError();

    return true;
}