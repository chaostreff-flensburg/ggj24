import { Scene } from "./IScene";
import { Input } from "../Input";
import { PuKMenu } from "./PuKMenu";

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
  private menu: PuKMenu = new PuKMenu();

  private pointofinterest: Array<PointOfInterest> = [];
  private action: string | undefined;
  private debug: boolean = false;

  // load scene image and points of interest
  load(): void {
    // load scene image
    this.image = new Image();
    this.image.src = "scene/sketch.png";
    this.image.onload = () => {
      this.imageLoadcomplete = true;
    };
    // 4 points of interest
    this.pointofinterest = [
      {
        x1: 0,
        x2: 100,
        y1: 0,
        y2: 100,
        action: "action1",
      },
      {
        x1: 100,
        x2: 200,
        y1: 0,
        y2: 100,
        action: "action2",
      },
      {
        x1: 0,
        x2: 100,
        y1: 100,
        y2: 200,
        action: "action3",
      },
      {
        x1: 100,
        x2: 200,
        y1: 100,
        y2: 200,
        action: "action4",
      },
    ];
	this.menu.load();
  }
  // update scene
  update(input: Input): void {
    /* console.log('update', input) */
    this.pointofinterest.forEach(
      (
        point: PointOfInterest,
      ) => {
        if (input.clicked === true &&
          input.x > point.x1 && input.y > point.y1 && input.x < point.x2 &&
          input.y < point.y2
        ) {
          if(this.menu.action !== "") {
            if(this.menu.action === point.action) {
              // do something
              console.log("do something");
            }
            else
            {
              // cant do that
              console.log("cant do that");
              this.menu.action = "";
            }
          }
        }
      },
    );
	this.menu.update(input);
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
    if (this.imageLoadcomplete) {
      context.drawImage(this.image!, 0, 0);
	    this.menu.render(context, input);
      if (this.debug) { // for debugging
        this.pointofinterest.forEach((poi) => {
          context.strokeStyle = "black";
          context.strokeRect(poi.x1, poi.y1, poi.x2 - poi.x1, poi.y2 - poi.y1);
        });
      }
    }
  }
}
