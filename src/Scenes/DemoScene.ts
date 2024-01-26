import { Scene } from "./IScene";
import { Input } from "../Input";

export class DemoScene implements Scene {
    private image: HTMLImageElement | null = null;
    private imageLoadcomplete = false;

    private pointofinterest: Array<
        { x1: number; x2: number; y1: number; y2: number; action: string }
    > = [];
    private action: string | undefined;

    load(): void {
        // load scene image
        this.image = new Image();
        this.image.src = "scene/sketch.png";
        this.image.onload = () => {
            this.imageLoadcomplete = true;
        };

        // load points of interest
        /* const pointofinterest = fetch("scene/scene1.json").then((response) => {
        response.json().then((data) => {
            this.pointofinterest = data.points;
        });
        }); */
    }

    update(input: Input): void {
        /* console.log('update', input) */
        /* this.pointofinterest.forEach(
            (
              point: {
                x1: number;
                x2: number;
                y1: number;
                y2: number;
                action: string;
              },
            ) => {
              if (
                mouseX > point.x1 && mouseY > point.y1 && mouseX < point.x2 &&
                mouseY < point.y2
              ) {
                console.log(point.action);
              }
            },
          ); */
    }
    render(context: CanvasRenderingContext2D): void {
        if (this.imageLoadcomplete) {
            context.drawImage(this.image!, 0, 0);
        }
    }
}