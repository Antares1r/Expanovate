import Entity from "./entity";

export default class Factory extends Entity{
    size: number[];
    constructor(id: string, position: number[], size: number[]) {
        super(id, position);
        this.size = size;
    }    
}