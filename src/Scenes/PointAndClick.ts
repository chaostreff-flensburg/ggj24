import { Scene } from "./IScene";
import { Input } from "../Input";
import { PaKMenu } from "./PaKMenu";

type PointOfInterest = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  action?: string;
  actions?: Array<{ action: string; text: string }>;
  text?: string;
};

export class PointAndClick implements Scene {
  private image: HTMLImageElement | null = null;
  private imageLoadcomplete = false;
  private menu: PaKMenu = new PaKMenu();

  private pointofinterest: Array<PointOfInterest> = [];
  private moveable: Array<PointOfInterest> = [];
  private action: string | undefined;
  private imagescroll: number = 0;
  private debug: boolean = false;

  // load scene image and points of interest
  load(): void {
    // load scene image
    this.image = new Image();
    this.image.src = "scene/scene1.png";
    this.image.onload = () => {
      this.imageLoadcomplete = true;
    };
    // 4 points of interest
    this.pointofinterest = {
      0: [
        {
          x1: 580,
          x2: 800,
          y1: 400,
          y2: 550,
          actions: [{ action: "open", text: "Es scheint verlossen zu sein" }, {
            action: "look",
            text: "Eine Garage Tür, die sich nicht öffnen lässt",
          }],
        },
      ],
      1: [
        {
          x1: 0,
          x2: 100,
          y1: 0,
          y2: 100,
          action: "open",
        },
        {
          x1: 100,
          x2: 200,
          y1: 0,
          y2: 100,
          action: "use",
        },
        {
          x1: 0,
          x2: 100,
          y1: 100,
          y2: 200,
          action: "talk",
        },
      ],
    };
    this.moveable = {
      0: [
        {
          x1: 100,
          x2: 1280,
          y1: 550,
          y2: 600,
        },
        {
          x1: 200,
          x2: 300,
          y1: 500,
          y2: 550,
        },
        {
          x1: 1230,
          x2: 1280,
          y1: 550,
          y2: 600,
          action: "moveup",
        },
      ],
      1: [
        {
          x1: 50,
          x2: 1280,
          y1: 550,
          y2: 600,
        },
        {
          x1: 0,
          x2: 50,
          y1: 550,
          y2: 600,
          action: "movedown",
        },
        {
          x1: 1230,
          x2: 1280,
          y1: 550,
          y2: 600,
          action: "moveup",
        }
      ],
    };
    this.menu.load();
  }
  // update scene
  update(input: Input): void {
    /* console.log('update', input) */
    if (
      input.clicked === true
    ) {
      this.pointofinterest[this.imagescroll].forEach(
        (
          point: PointOfInterest,
        ) => {
          if (
            input.x > point.x1 && input.y > point.y1 && input.x < point.x2 &&
            input.y < point.y2
          ) {
            if (this.menu.action !== "") {
              point.actions?.forEach((action) => {
                //console.log("this.menu.action", this.menu.action);
                //console.log("point.action", action);
                if (this.menu.action === action.action) {
                  // do something
                  console.log("do something");
                  if (action.text) {
                    alert(action.text);
                  }
                } else {
                  // cant do that
                  console.log("cant do that");
                }
              });
              this.menu.action = ""; // reset action
            }
          }
        },
      );
      this.moveable[this.imagescroll].forEach(
        (
          point: PointOfInterest,
        ) => {
          if (
            input.x > point.x1 && input.y > point.y1 && input.x < point.x2 &&
            input.y < point.y2
          ) {
            // move image scroll
            if (point.action === "movedown") {
              console.log("movedown");
              this.imagescroll -= 1;
            }
            if (point.action === "moveup") {
              console.log("moveup");
              this.imagescroll += 1;
            }
          }
        },
      );
    }
    this.menu.update(input);
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
    if (this.imageLoadcomplete) {
      context.drawImage(this.image!, -1280 * this.imagescroll, 0);
      this.menu.render(context, input);
      if (this.debug) { // for debugging
        this.pointofinterest[this.imagescroll].forEach((poi) => {
          context.strokeStyle = "black";
          context.strokeRect(poi.x1, poi.y1, poi.x2 - poi.x1, poi.y2 - poi.y1);
        });
        this.moveable[this.imagescroll].forEach((poi) => {
          context.strokeStyle = "red";
          context.strokeRect(poi.x1, poi.y1, poi.x2 - poi.x1, poi.y2 - poi.y1);
        });
      }
    }
  }
}
