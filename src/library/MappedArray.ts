export class MappedArray<K, V> extends Map<K, V>{
    protected m_array: {key: K, value: V}[] = [];

    clear(): void {
        this.m_array = [];
        super.clear();

        return;
    }

    delete(key: K): boolean {
        if(super.delete(key)){
            this.setArray();
            return true;
        }
        return false;
    }

    set(key: K, value: V): this;
    set(arr: {key: K, value: V}[]): this;
    set(key: K | {key: K, value: V}[], value?: V): this{
        if(Array.isArray(key)){
            for(const ele of key)
                super.set(ele.key, ele.value);

            this.setArray();
        }
        else{
            super.set(key, value!);

            this.setArray();
        }

        return this;
    }

    random(): {key: K, value: V}{
        const idx = Math.floor(Math.random() * this.size);

        return this.m_array[idx];
    }

    private setArray(){
        this.m_array = Array.from(this.entries()).map(value => ({key: value[0], value: value[1]}));
    }
}