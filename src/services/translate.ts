import { ServiceFileSupabase } from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { isTranslate, Translate } from "@models";
import { supabase } from "@shared/supabase";

export class TranslateService{
    protected static readonly dbName = "translate";

    public static serviceSupabase = new ServiceFileSupabase<Translate, "id">(
            supabase,
            "id",  
            {
                tableName: TranslateService.dbName,
                typeGuard: isTranslate,
                useCache: true
            }
        );

    public static async setNewTranslate(translate: StrictOmit<Translate, "id">): Promise<Translate>{
        return await TranslateService
            .serviceSupabase
            .add(translate);
    }

    public static async getTranslateByName(name: string): Promise<Translate | null>{
        for(const translate of (await TranslateService.serviceSupabase.getAll())){
            for(const translateName of translate.name){
                if(name.match(`((\\s|\\+)${translateName}(\\s|\\+))|(^${translateName}(\\s|\\+))|((\\s|\\+)${translateName}$)`)){
                    return translate;
                }
            }
        }

        return null;
    }

    public static async getPossibleTranslatesFromString(str: string): Promise<Translate[]>{
        return TranslateService
            .serviceSupabase
            .cache
            .filter((translate) => {
                for(const translateName of translate.name){
                    if(str.match(`((\\s|\\+)${translateName}(\\s|\\+))|(^${translateName}(\\s|\\+))|((\\s|\\+)${translateName}$)`))
                        return true;
                }

                return false;
            })
    }
}