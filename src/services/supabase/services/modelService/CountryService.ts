import { supabaseModels } from "@shared/supabase";
import { Country, countryCreate, CountryCreate, countryUpdate, CountryUpdate } from "../../types/models/Country";
import { FileUpload } from "@library";

export const tableName = "countries";
export const bucketName = "flags";
export const fileUpload = new FileUpload(bucketName, supabaseModels);

async function getCountry(country: Country["country"]): Promise<Country>{
    const {data} = await supabaseModels
        .from(tableName)
        .select()
        .eq("country", country)
        .single()
        .throwOnError();
        
    return data!;
}

export async function createCountry(schema: CountryCreate): Promise<Country>{
    const parsed = countryCreate.parse(schema);

    let image: string | undefined = undefined;
    if(parsed.image)
        image = await fileUpload.uploadFile(parsed.image, {filename: parsed.country.country});
    
    const {data} = await supabaseModels
        .from(tableName)
        .insert({
            ...parsed.country,
            flag: image
        })
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function updateCountry(
    country: Country["country"], 
    schema: CountryUpdate, 
): Promise<Country>{
    const parsed = countryUpdate.parse(schema);

    const get = await getCountry(country);

    let image: string | null | undefined = undefined;
    if(parsed.image !== undefined){
        if(get.flag)
            await fileUpload.removeFile(get.flag)

        image = parsed.image ? await fileUpload.uploadFile(parsed.image, {filename: country}) : null;
    }

    const {data} = await supabaseModels
        .from(tableName)
        .update({
            ...parsed.country,
            flag: image
        })
        .eq("country", country)
        .select()
        .single()
        .throwOnError();

    return data!;
}

export async function deleteCountry(country: Country["country"]): Promise<true>{
    const get = await getCountry(country);

    if(get.flag)
        fileUpload.removeFile(get.flag);

    await supabaseModels
        .from(tableName)
        .delete()
        .eq("country", country)
        .throwOnError();

    return true;
}