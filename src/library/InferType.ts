function inferStructure(data: unknown): any {
    if (Array.isArray(data)) {
        const uniqueTypes = Array.from(new Set(data.map((item) => {
            if (typeof item === "object") {
                return JSON.stringify(inferStructure(item));
            }

            return typeof item;
        })));

        return uniqueTypes.length > 1 ? `(${uniqueTypes.join(" | ")})[]` : `(${uniqueTypes[0]})[]`;
    }

    if (typeof data === "object" && data !== null) {
        const entries = Object.entries(data).reduce((acc, [key, value]) => {
            acc[key] = JSON.stringify(inferStructure(value));
            return acc;
        }, {} as Record<string, string>);

        return entries;
    }

    return typeof data;
}

export function inferType(data: unknown): string {
    const response = JSON.stringify(inferStructure(data))

    let str = "";
    let depth = 0;

    for(const char of response){
        switch(char){
            case "\\":
            case "\"":
                break;
            case ",":
                str += `;\n${"   ".repeat(depth)}`;
                break;
            case "{":
                ++depth;
                str += `${char}\n${"   ".repeat(depth)}`;
                break;
            case "}":
                --depth;
                if(depth === 0)
                    str += ";";
                str += `\n${"   ".repeat(depth)}${char}`;
                break;
            case ":":
                str += `: `;
                break;
            default:
                str += char;
        }
    }

    return str;
}