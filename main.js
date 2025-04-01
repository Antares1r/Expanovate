"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("./src/entities/factory");
var inputPoint_1 = require("./src/entities/inputPoint");
var wire_1 = require("./src/entities/wire");
var game_1 = require("./src/main/game");
var game = new game_1.Game();
var r = game.returnR();
var factories = [
    new factory_1.default("FC1", [30, 50], [50, 30])
];
var wires = [
    new wire_1.default("WR1", [80, 70 - (50 / 20)], [r.GetMouseX(), r.GetMouseY()])
];
var inputPoints = [
    new inputPoint_1.default("IP1", [50, 50], [wires[0]], factories[0])
];
var outputPoints = [];
var Entites = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], factories, true), wires, true), inputPoints, true), outputPoints, true);
game.entities = Entites;
game.draw();
