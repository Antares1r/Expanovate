import Entity from "./entity";

export default class Wire extends Entity{
    endPosition: number[]
    constructor(id: string, position: number[], endPosition: number[]) {
        super(id, position)
        this.endPosition = endPosition;
    }    
}