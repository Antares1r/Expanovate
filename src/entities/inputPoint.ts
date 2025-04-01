import Entity from "./entity";
import Factory from "./factory";
import Wire from "./wire";

export default class InputPoint extends Entity{
    inputs: Wire[];
    ownerFactory: Factory;

    constructor(id: string, position: number[], inputs: Wire[], ownerFactory: Factory) {
        super(id, position);
        this.ownerFactory = ownerFactory;
        this.inputs = inputs;
    }
}