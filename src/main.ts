import { DemoScene } from "./DemoScene";
import { Scene } from "./IScene";
import { InputManager } from "./Input";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private pointofinterest: Array<
    { x1: number; x2: number; y1: number; y2: number; action: string }
  > = [];
  private action: string | undefined;

  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];

  private scene: Scene;

  private inputManager:InputManager;

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    this.scene = new DemoScene();

    if (!context) {
      throw new Error("Canvas context is not defined");
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";
    context.lineWidth = 1;

    this.canvas = canvas;
    this.context = context;

    // load scene image
    const image = new Image();
    image.src = "scene/scene1.png";
    image.onload = () => {
      context.drawImage(image, 0, 0);
    };
    this.inputManager = new InputManager(canvas);
    // load points of interest
    const pointofinterest = fetch("scene/scene1.json").then((response) => {
      response.json().then((data) => {
        this.pointofinterest = data.points;
      });
    });
    


    this.redraw();
  }
  private createUserEvents() {
    const canvas = this.canvas;

    canvas.addEventListener("mousedown", this.pressEventHandler);
    canvas.addEventListener("mouseup", this.releaseEventHandler);
    canvas.addEventListener("mouseout", this.cancelEventHandler);

    canvas.addEventListener("touchstart", this.pressEventHandler);
    canvas.addEventListener("touchend", this.releaseEventHandler);
    canvas.addEventListener("touchcancel", this.cancelEventHandler);
  }

  private redraw() {
    const clickX = this.clickX;
    const clickY = this.clickY;
    const context = this.context;
  }

  private clearCanvas() {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  private releaseEventHandler = () => {
    this.redraw();
  };

  private cancelEventHandler = () => {
  };
  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageX
      : (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    console.log(mouseX, mouseY);
    this.pointofinterest.forEach(
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
    );

    this.redraw();
  };

  update() {
    this.scene.update(this.inputManager.input);
    this.inputManager.update();
  }

  render() {
    this.scene.render(this.context)
  }
}

const app = new DrawingApp();

const loop = () => {
  app.update();
  app.render();
  
  window.requestAnimationFrame(loop);
}

loop();