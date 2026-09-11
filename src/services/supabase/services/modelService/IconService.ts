import { supabaseModels } from "@shared/supabase";
import { 
    Icon, 
    iconCreate, 
    IconCreate, 
    iconUpdate, 
    IconUpdate, 
    iconFileUploader 
} from "@services/supabase/types";

export const tableName = "icons";

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
            image: await iconFileUploader.uploadFile(parsed.image.file, {
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

    const newFileName = (parsed.icon.category ?? get.category) + "_" + get.icon;

    let image: string | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.image)
            await iconFileUploader.removeFile(get.image)

        image = await iconFileUploader.uploadFile(parsed.image.file, {
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
        iconFileUploader.removeFile(get.image);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("icon", icon)
        .throwOnError();

    return true;
}