"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var raylib = require("raylib");
var wire_1 = require("../entities/wire");
var factory_1 = require("../entities/factory");
var inputPoint_1 = require("../entities/inputPoint");
var console_1 = require("console");
var moneyManagment_1 = require("../entities/moneyManagment");
var Game = /** @class */ (function () {
    function Game() {
        this.FCIDCOUNTER = 0;
        this.IPIDCOUNTER = 0;
        this.coinManager = new moneyManagment_1.CoinManager();
        this.r = raylib;
        //this.placeFactory()
    }
    Game.prototype.createInputPoint = function (x, y, wires) {
        var targetFactory = null;
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            if (entity instanceof factory_1.default) {
                var fx = entity.position[0];
                var fy = entity.position[1];
                var fw = entity.size[0];
                var fh = entity.size[1];
                if (x >= fx && x <= fx + fw && y >= fy && y <= fy + fh) {
                    targetFactory = entity;
                    break;
                }
            }
        }
        if (targetFactory) {
            this.IPIDCOUNTER++;
            this.entities.push(new inputPoint_1.default("IP" + this.IPIDCOUNTER, [x, y], wires, targetFactory));
        }
    };
    Game.prototype.placeInputPoint = function () {
        this.r.DrawRectangle(this.r.GetMouseX(), this.r.GetMouseY(), 10, 10, this.r.RED);
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_RIGHT)) {
            this.createInputPoint(this.r.GetMouseX(), raylib.GetMouseY(), []);
            (0, console_1.log)("added IP: " + this.IPIDCOUNTER);
        }
    };
    Game.prototype.placeFactory = function () {
        this.r.DrawRectangle(this.r.GetMouseX(), this.r.GetMouseY(), 50, 30, this.r.BLUE);
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_LEFT)) {
            this.FCIDCOUNTER++;
            this.entities.push(new factory_1.default("FC" + this.FCIDCOUNTER, [this.r.GetMouseX(), raylib.GetMouseY()], [50, 30]));
            (0, console_1.log)("added FC: " + this.FCIDCOUNTER);
        }
    };
    Game.prototype.draw = function () {
        var screenWidth = 1920;
        var screenHeight = 1028;
        this.r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
        this.r.SetTargetFPS(128);
        while (!this.r.WindowShouldClose()) {
            this.r.BeginDrawing();
            this.r.ClearBackground(this.r.RAYWHITE);
            this.placeFactory();
            this.placeInputPoint();
            for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                if (entity instanceof wire_1.default) {
                    this.r.DrawLine(entity.position[0], entity.position[1], entity.endPosition[0], entity.endPosition[1], this.r.BLUE);
                }
                else if (entity instanceof factory_1.default) {
                    this.r.DrawRectangle(entity.position[0], entity.position[1], entity.size[0], entity.size[1], this.r.DARKBLUE);
                }
                else if (entity instanceof inputPoint_1.default) {
                    this.r.DrawRectangle(entity.position[0], entity.position[1], 10, 10, this.r.RED);
                }
            }
            this.entities = this.entities;
            this.r.EndDrawing();
        }
        this.r.CloseWindow();
    };
    Game.prototype.returnR = function () {
        return this.r;
    };
    return Game;
}());
exports.Game = Game;
