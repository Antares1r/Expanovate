import * as raylib from 'raylib';
import Entity from '../entities/entity';
import Wire from '../entities/wire';
import Factory from '../entities/factory';
import InputPoint from '../entities/inputPoint';
import { log } from 'console';
import { CoinManager } from '../entities/moneyManagment';

export class Game {
    r: typeof raylib;
    entities: Entity[]
    FCIDCOUNTER: number = 0
    IPIDCOUNTER: number = 0

    coinManager: CoinManager = new CoinManager();

    createInputPoint(x: number, y: number, wires: Wire[]) {
        let targetFactory: Factory | null = null;
        for (const entity of this.entities) {
            if (entity instanceof Factory) {
                const fx = entity.position[0];
                const fy = entity.position[1];
                const fw = entity.size[0];
                const fh = entity.size[1];
                
                if (x >= fx && x <= fx + fw && y >= fy && y <= fy + fh) {
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
        this.r.DrawRectangle(this.r.GetMouseX(), this.r.GetMouseY(), 10, 10, this.r.RED)
        if(this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_RIGHT)) {
            this.createInputPoint(this.r.GetMouseX(), raylib.GetMouseY(), [])
            log("added IP: " + this.IPIDCOUNTER)
        }
    }

    placeFactory() {
        this.r.DrawRectangle(this.r.GetMouseX(), this.r.GetMouseY(), 50, 30, this.r.BLUE)
        if(this.r.IsMouseButtonDown(this.r.MOUSE_BUTTON_LEFT)) {
            this.FCIDCOUNTER++
            this.entities.push(new Factory("FC" + this.FCIDCOUNTER, [this.r.GetMouseX(), raylib.GetMouseY()], [50, 30]))
            log("added FC: " + this.FCIDCOUNTER)
        }

    }
    draw() {
        const screenWidth = 1920
        const screenHeight = 1028
        this.r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window")
        this.r.SetTargetFPS(128)

        while (!this.r.WindowShouldClose()) {
            this.r.BeginDrawing();
            this.r.ClearBackground(this.r.RAYWHITE)
            this.placeFactory()
            this.placeInputPoint()
            for (const entity of this.entities) {
                if (entity instanceof Wire) {
                    this.r.DrawLine(entity.position[0], entity.position[1], entity.endPosition[0], entity.endPosition[1], this.r.BLUE)
                } else if (entity instanceof Factory) {
                    this.r.DrawRectangle(entity.position[0], entity.position[1], entity.size[0], entity.size[1], this.r.DARKBLUE)
                } else if (entity instanceof InputPoint) {
                    this.r.DrawRectangle(entity.position[0], entity.position[1], 10, 10, this.r.RED)
                }
            }
            this.entities = this.entities;
            this.r.EndDrawing()
        }
        this.r.CloseWindow()
    }
    returnR(): typeof raylib {
        return this.r;
    }

    constructor() {
        this.r = raylib;
        //this.placeFactory()
    }
}