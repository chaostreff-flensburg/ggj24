import { Input } from "./Input";

export interface Scene {
    update(input:Input):void;
    render(context:CanvasRenderingContext2D):void;
}