import Entity from "./src/entities/entity";
import Factory from "./src/entities/factory";
import InputPoint from "./src/entities/inputPoint";
import Wire from "./src/entities/wire";
import { Game } from "./src/main/game";

const game = new Game();
const r = game.returnR();

const factories = [
    new Factory("FC1", [30,50], [50,30])
];
const wires = [
    new Wire("WR1", [80, 70 - (50 / 20)], [r.GetMouseX(),r.GetMouseY()])
]
const inputPoints = [
    new InputPoint("IP1", [50, 50], [wires[0]], factories[0])
]
const outputPoints = [

]
const Entites: Entity[] = [
    ...factories,
    ...wires,
    ...inputPoints,
    ...outputPoints
]

game.entities = Entites;
game.draw()