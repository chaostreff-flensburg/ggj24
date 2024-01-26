import { Scene } from "./IScene";
import { Input } from "./Input";

export class DemoScene implements Scene {
    update(input:Input): void {
        /* console.log('update', input) */
    }
    render(context: CanvasRenderingContext2D): void {
       /*  console.log('render'); */
    }
}