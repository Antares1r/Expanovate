import * as raylib from 'raylib';
import Entity from '../entities/entity';
import Wire from '../entities/wire';
import Factory from '../entities/factory';
import InputPoint from '../entities/inputPoint';
import OutputPoint from '../entities/outputPoint';
import { log } from 'console';
import { CoinManager } from '../entities/moneyManagment';

export class Game {
    r: typeof raylib;
    entities: Entity[] = [];
    FCIDCOUNTER: number = 0;
    IPIDCOUNTER: number = 0;
    placementCooldown: number = 500;
    lastPlacementTime: number = 0;

    coinManager: CoinManager = new CoinManager();
    secondConnectingLevel: boolean = false;
    equipIndex: number = 1;
    targetPoint1: Entity | null = null;
    targetPoint2: Entity | null = null;

    isPositionOccupied(x: number, y: number, width: number, height: number): boolean {
        for (const entity of this.entities) {
            const ex = entity.position[0];
            const ey = entity.position[1];
            const ew = entity instanceof Factory ? entity.size[0] : 10;
            const eh = entity instanceof Factory ? entity.size[1] : 10;
            
            if (x < ex + ew && x + width > ex && y < ey + eh && y + height > ey) {
                return true;
            }
        }
        return false;
    }

    createInputPoint(x: number, y: number, wires: Wire[]) {
        let targetFactory: Factory | null = null;
        for (const entity of this.entities) {
            if (entity instanceof Factory) {
                const fx = entity.position[0];
                const fy = entity.position[1];
                const fw = entity.size[0];
                const fh = entity.size[1];
                if (x >= fx && x <= fx + fw && y >= fy && y <= fy + fh) {
                    log(`Checking Factory ${entity.id} at (${fx}, ${fy}) with size ${fw}x${fh}`);
                    targetFactory = entity;
                    break;
                }
            }
        }
        
        if (targetFactory) {
            this.IPIDCOUNTER++;
            this.entities.push(new InputPoint("IP" + this.IPIDCOUNTER, [x, y], wires, targetFactory));
        }        
    }

    placeInputPoint() {
        if (Date.now() - this.lastPlacementTime < this.placementCooldown) return;
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_RIGHT) && this.equipIndex === 2) {
            this.createInputPoint(this.r.GetMouseX(), this.r.GetMouseY(), []);
            log("added IP: " + this.IPIDCOUNTER + this.entities);
            this.lastPlacementTime = Date.now();
        }
    }

    placeFactory() {
        if (Date.now() - this.lastPlacementTime < this.placementCooldown) return;
        const mouseX = this.r.GetMouseX();
        const mouseY = this.r.GetMouseY();
        
        if (this.isPositionOccupied(mouseX, mouseY, 50, 30)) return;
        
        if (this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_RIGHT) && this.equipIndex === 1) {
            this.FCIDCOUNTER++;
            this.entities.push(new Factory("FC" + this.FCIDCOUNTER, [mouseX, mouseY], [50, 30]));
            log("added FC: " + this.FCIDCOUNTER);
            this.lastPlacementTime = Date.now();
        }
    }

    checkInput() {
        for (let i: number = 0; i <= 9; i++) {
            if (this.r.IsKeyDown(this.r.KEY_ZERO + i)) {
                this.equipIndex = i;
            }
        } 
        this.r.DrawText(String(this.equipIndex), 10, 10, 10, this.r.BLACK);
    }

    draw() {
        const screenWidth = 1920;
        const screenHeight = 1028;
        this.r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
        this.r.SetTargetFPS(128);

        while (!this.r.WindowShouldClose()) {
            this.r.BeginDrawing();
            this.r.ClearBackground(this.r.RAYWHITE);
            this.placeFactory();
            this.placeInputPoint();
            this.checkInput();
            for (const entity of this.entities) {
                if (entity instanceof Wire) {
                    this.r.DrawLine(entity.position[0], entity.position[1], entity.endPosition[0], entity.endPosition[1], this.r.BLUE);
                } else if (entity instanceof Factory) {
                    this.r.DrawRectangle(entity.position[0], entity.position[1], entity.size[0], entity.size[1], this.r.DARKBLUE);
                } else if (entity instanceof InputPoint) {
                    this.r.DrawRectangle(entity.position[0], entity.position[1], 10, 10, this.r.RED);
                }
            }
            this.r.EndDrawing();
        }
        this.r.CloseWindow();
    }

    returnR(): typeof raylib {
        return this.r;
    }

    constructor() {
        this.r = raylib;
        this.placementCooldown = 500; // 500ms cooldown
        this.lastPlacementTime = 0;
    }
}