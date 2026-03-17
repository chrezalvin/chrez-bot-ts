import { ServiceFileSupabase } from "@library";
import { isTrait, Trait } from "@models/Trait";
import { supabase } from "@shared/supabase";

export class TraitService{
    protected static readonly tableName = "traits";
    protected static readonly imgDir = "images/traits";
    protected static readonly bucketName = "images";

    static serviceSupabase = new ServiceFileSupabase<Trait, "trait_id", never, "img_path">(
        supabase,
        "trait_id", 
        {
            tableName: TraitService.tableName,
            typeGuard: isTrait,
            useCache: true,
        },
        {
            bucketName: TraitService.bucketName,
            storagePath: TraitService.imgDir,
            fileKey: "img_path",
        }
    );

    static async getAll(): Promise<Trait[]>{
        return await TraitService.serviceSupabase.getAll();
    }

    static async getTraitByName(name: Trait["name"]): Promise<Trait[]>{
        if(name.length < 3)
            throw new Error("Name must be at least 3 characters long");

        const res = await TraitService
            .serviceSupabase
            .queryBuilder(query => query.ilike("name", `%${name}%`));

        if(!Array.isArray(res))
            throw new Error("Failed to get trait");

        return res;
    }

    static async setNewTrait(trait: Omit<Trait, "trait_id" | "img_path">, imgBlob?: Blob): Promise<Trait>{
        const fileName = trait.name.replace(/\s/g, "_").toLowerCase();
        const newTrait = await TraitService.serviceSupabase.add(trait, {
            file: imgBlob ?? null,
            fileName,
        });

        return newTrait;
    }

    static async updateTrait(
        id: Trait["trait_id"], 
        trait: Partial<Omit<Trait, "trait_id">>, 
        imgBlob?: Blob
    ): Promise<Trait>{
        const existingTrait = await TraitService.serviceSupabase.get(id);
        const newFileName = (trait.name ?? existingTrait.name).replace(/\s/g, "_").toLowerCase();

        if(imgBlob)
            return await TraitService.serviceSupabase.update(id, trait, {file: imgBlob, fileName: newFileName});
        else
            return await TraitService.serviceSupabase.update(id, trait);
    }

    static async deleteTraitById(traitId: Trait["trait_id"]){
        return await TraitService.serviceSupabase.delete(traitId);
    }
}