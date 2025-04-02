"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var raylib = require("raylib");
var wire_1 = require("../entities/wire");
var factory_1 = require("../entities/factory");
var inputPoint_1 = require("../entities/inputPoint");
var outputPoint_1 = require("../entities/outputPoint");
var console_1 = require("console");
var moneyManagment_1 = require("../entities/moneyManagment");
var Game = /** @class */ (function () {
    function Game() {
        this.entities = [];
        this.FCIDCOUNTER = 0;
        this.IPIDCOUNTER = 0;
        this.placementCooldown = 500;
        this.lastPlacementTime = 0;
        this.lastConnectionTime = 0;
        this.coinManager = new moneyManagment_1.CoinManager();
        this.secondConnectingLevel = false;
        this.equipIndex = 1;
        this.targetPoint1 = null;
        this.targetPoint2 = null;
        this.r = raylib;
        this.placementCooldown = 500; // 500ms cooldown
        this.lastPlacementTime = 0;
    }
    Game.prototype.isPositionOccupied = function (x, y, width, height) {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            var ex = entity.position[0];
            var ey = entity.position[1];
            var ew = entity instanceof factory_1.default ? entity.size[0] : 10;
            var eh = entity instanceof factory_1.default ? entity.size[1] : 10;
            if (x < ex + ew && x + width > ex && y < ey + eh && y + height > ey) {
                return true;
            }
        }
        return false;
    };
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
                    (0, console_1.log)("Checking Factory ".concat(entity.id, " at (").concat(fx, ", ").concat(fy, ") with size ").concat(fw, "x").concat(fh));
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
        if (Date.now() - this.lastPlacementTime < this.placementCooldown)
            return;
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_RIGHT) && this.equipIndex === 2) {
            this.createInputPoint(this.r.GetMouseX(), this.r.GetMouseY(), []);
            (0, console_1.log)("added IP: " + this.IPIDCOUNTER + this.entities);
            this.lastPlacementTime = Date.now();
        }
    };
    Game.prototype.placeFactory = function () {
        if (Date.now() - this.lastPlacementTime < this.placementCooldown)
            return;
        var mouseX = this.r.GetMouseX();
        var mouseY = this.r.GetMouseY();
        if (this.isPositionOccupied(mouseX, mouseY, 50, 30))
            return;
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_RIGHT) && this.equipIndex === 1) {
            this.FCIDCOUNTER++;
            this.entities.push(new factory_1.default("FC" + this.FCIDCOUNTER, [mouseX, mouseY], [50, 30]));
            (0, console_1.log)("added FC: " + this.FCIDCOUNTER);
            this.lastPlacementTime = Date.now();
        }
    };
    Game.prototype.connectWire = function () {
        if (Date.now() - this.lastConnectionTime < this.placementCooldown)
            return;
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_LEFT)) {
            (0, console_1.log)("Pressed Left!");
            var mouseX = this.r.GetMouseX();
            var mouseY = this.r.GetMouseY();
            (0, console_1.log)("Pressed Left!" + mouseX + mouseY);
            for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                (0, console_1.log)(entity);
                (0, console_1.log)('e');
                if (!this.secondConnectingLevel) {
                    (0, console_1.log)('e');
                    if (entity instanceof inputPoint_1.default || entity instanceof outputPoint_1.default) {
                        var fx = entity.position[0];
                        var fy = entity.position[1];
                        var fw = 10;
                        var fh = 10;
                        if (mouseX >= fx && mouseX <= fx + fw && mouseY >= fy && mouseY <= fy + fh) {
                            this.targetPoint1 = entity;
                            this.secondConnectingLevel = true;
                            (0, console_1.log)("First connection point selected");
                            this.r.DrawLine(fx, fy, this.r.GetMouseX(), this.r.GetMouseY(), this.r.SKYBLUE);
                            this.lastConnectionTime = Date.now();
                            break;
                        }
                    }
                }
                else {
                    (0, console_1.log)('e');
                    if (entity instanceof inputPoint_1.default || entity instanceof outputPoint_1.default) {
                        (0, console_1.log)('e' + this.entities);
                        var fx = entity.position[0];
                        var fy = entity.position[1];
                        var fw = 10;
                        var fh = 10;
                        if (mouseX >= fx && mouseX <= fx + fw && mouseY >= fy && mouseY <= fy + fh) {
                            this.targetPoint2 = entity;
                            (0, console_1.log)("Second connection point selected");
                            this.lastConnectionTime = Date.now();
                            break;
                        }
                    }
                }
            }
        }
    };
    Game.prototype.checkInput = function () {
        for (var i = 0; i <= 9; i++) {
            if (this.r.IsKeyDown(this.r.KEY_ZERO + i)) {
                this.equipIndex = i;
            }
        }
        this.r.DrawText(String(this.equipIndex), 10, 10, 10, this.r.BLACK);
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
            this.checkInput();
            this.connectWire();
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
