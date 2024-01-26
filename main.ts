/// <reference lib="dom" />
import { CanvasRenderingContext2D, HTMLCanvasElement } from "canvas";
import { MouseEvent, TouchEvent } from "dom";
class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private action: string | undefined;

  private clickX: number[] = [];
  private clickY: number[] = [];
  private clickDrag: boolean[] = [];

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";
    context.lineWidth = 1;

    this.canvas = canvas;
    this.context = context;

    this.redraw();
    this.createUserEvents();
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
	const pointofintrare:any = [];

	pointofintrare.forEach((point : {x1: number, x2: number, y1: number,y2: number}) => {
		if(mouseX > point.x1 && mouseY > point.y1 && mouseX < point.x2 && mouseY < point.y2) {
			console.log("in");
		}
	});

    this.redraw();
  };
}

new DrawingApp();
