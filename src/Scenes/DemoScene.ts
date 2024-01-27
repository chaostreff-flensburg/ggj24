import { Scene } from "./IScene";
import { Input } from "../Input";

type PointOfInterest = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  action: string;
};

export class DemoScene implements Scene {
  private image: HTMLImageElement | null = null;
  private imageLoadcomplete = false;

  private pointofinterest: Array<PointOfInterest> = [];
  private action: string | undefined;

  // load scene image and points of interest
  load(): void {
    // load scene image
    this.image = new Image();
    this.image.src = "scene/sketch.png";
    this.image.onload = () => {
      this.imageLoadcomplete = true;
    };

    // load points of interest
    fetch("scene/scene1.json").then((response) => {
      response.json().then((data) => {
        this.pointofinterest = data.points as Array<PointOfInterest>;
      });
    });
  }

  // update scene
  update(input: Input): void {
    /* console.log('update', input) */
    this.pointofinterest.forEach(
      (
        point: PointOfInterest,
      ) => {
        if (
          input.x > point.x1 && input.y > point.y1 && input.x < point.x2 &&
          input.y < point.y2
        ) {
          console.log(point.action);
        }
      },
    );
  }

  // render scene
  render(context: CanvasRenderingContext2D): void {
    if (this.imageLoadcomplete) {
      context.drawImage(this.image!, 0, 0);
    }
  }
}