export default class Entity {
    id: string;
    position: number[];
    constructor(id: string, position: number[]) {
        this.id = id;
        this.position = position;
    }
}