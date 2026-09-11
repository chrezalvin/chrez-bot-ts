export class DSATreeNode<_T>{
    public value: _T;
    public nexts: DSATreeNode<_T>[];
    public prev: DSATreeNode<_T> | null;

    constructor(
        value: _T, 
        prev: DSATreeNode<_T> | null = null, 
        nodes: DSATreeNode<_T>[] = []
    ){
        this.value = value;
        this.nexts = nodes;
        this.prev = prev;
    }

    public addNext(next: DSATreeNode<_T>){
        this.nexts.push(next);
    }

    static toArray<_T>(node: DSATreeNode<_T>, depth = 0): {data: _T, depth: number}[]{
        if(depth === 0){
            const arr = DSATreeNode.linePredecessor(node).map((val, idx) => ({data: val, depth: idx}));
            const currentDepth = arr.length > 0 ? arr[arr.length - 1].depth + 1 : 1;

            for(const next of node.nexts)
                arr.push(...this.toArray(next, currentDepth))

            return arr;
        }
        else{
            const arr2 = [{data: node.value, depth: depth}];
            for(const next of node.nexts)
                arr2.push(...this.toArray(next, depth + 1))

            return arr2;
        }
    }

    static createTree<_T>(
        data: _T,
        next: (data: _T) => _T[]
    ): DSATreeNode<_T>{
        const node = new DSATreeNode(data);
    
        const nextData = next(data);
    
        for(const ele of nextData){
            const child = this.createTree(ele, next);
            child.prev = node;
            node.addNext(child);
        }
    
        return node;
    }
    
    static find<_T>(node: DSATreeNode<_T> | null, cmpr: (data: _T) => boolean): DSATreeNode<_T> | null{
        if(node === null)
            return null;
    
        if(cmpr(node.value))
            return node;
    
        for(const next of node.nexts){
            const found =  this.find(next, cmpr);
            if(found)
                return found;
        }
    
        return null;
    }

    static linePredecessor<_T>(node: DSATreeNode<_T>): _T[]{
        const arr: _T[] = [];

        for(let current: DSATreeNode<_T> | null = node; current !== null; current = current.prev)
            arr.push(current.value);

        return arr.reverse();
    }
}

export default DSATreeNode;