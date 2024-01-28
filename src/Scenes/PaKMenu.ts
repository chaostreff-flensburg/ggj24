// Menu for the point and click game
import { Input } from "../Input";
import { Scene } from "./IScene";

type PointOfInterest = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  action: string;
};

export class PaKMenu implements Scene {
  private image: HTMLImageElement | null = null;
  private imageLoadcomplete = false;

  private pointofinterest: Array<PointOfInterest> = [];
  action: string = "";
  private actionimage: HTMLImageElement | null = null;
  private inventory: string[] = [];
  public debug: boolean = false;

  load(): void {
    // load scene image
    this.image = new Image();
    this.image.src = "scene/menu.png";
    this.image.onload = () => {
      this.imageLoadcomplete = true;
    };
    // 4 points of interest // Menu for the point and click game
    this.pointofinterest = [
      {
        x1: 5,
        x2: 130,
        y1: 655,
        y2: 695,
        action: "open",
      },
      {
        x1: 5,
        x2: 195,
        y1: 705,
        y2: 740,
        action: "close",
      },
      {
        x1: 5,
        x2: 120,
        y1: 750,
        y2: 785,
        action: "give",
      },

      {
        x1: 210,
        x2: 390,
        y1: 660,
        y2: 695,
        action: "pickup",
      },
      {
        x1: 210,
        x2: 405,
        y1: 700,
        y2: 740,
        action: "look",
      },
      {
        x1: 200,
        x2: 410,
        y1: 750,
        y2: 790,
        action: "talk",
      },

      {
        x1: 440,
        x2: 605,
        y1: 660,
        y2: 695,
        action: "push",
      },
      {
        x1: 445,
        x2: 570,
        y1: 700,
        y2: 745,
        action: "pull",
      },
      {
        x1: 440,
        x2: 610,
        y1: 750,
        y2: 790,
        action: "use",
      },
    ];
  }

  // update scene
  update(input: Input): void {
    if (this.imageLoadcomplete) {
      if (input.clicked == true) {
        this.pointofinterest.forEach((poi) => {
          if (
            input.x >= poi.x1 &&
            input.x <= poi.x2 &&
            input.y >= poi.y1 &&
            input.y <= poi.y2
          ) {
            this.action = poi.action;
          }
        });
        if (this.action !== "") {
          this.actionimage = new Image();
          this.actionimage.src = "scene/" + this.action + ".png";
        }
      }
    }
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
    if (this.imageLoadcomplete) {
      context.drawImage(this.image!, 0, 650);
      if (
        this.action !== "" && this.actionimage != null &&
        this.actionimage.src !== ""
      ) {
        context.drawImage(this.actionimage!, input.x, input.y);
      }
      if (this.debug) { // for debugging
        this.pointofinterest.forEach((poi) => {
          context.strokeStyle = "black";
          context.strokeRect(poi.x1, poi.y1, poi.x2 - poi.x1, poi.y2 - poi.y1);
        });
      }
    }
  }
}
