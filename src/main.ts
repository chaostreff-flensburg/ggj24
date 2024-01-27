import { DemoScene } from "./Scenes/DemoScene";
import { Scene } from "./Scenes/IScene";
import { InputManager } from "./Input";
import { CardBoardScene } from "./Scenes/CardBoardScene";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private scene: Scene;

  private inputManager: InputManager;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;

    this.inputManager = new InputManager(this.canvas);

    this.scene = new DemoScene();
    this.scene.load();
  }

  update() {
    this.scene.update(this.inputManager.input);
    this.inputManager.update();
  }

  render() {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.scene.render(this.context)
  }

  start() {
    const loop = () => {
      app.update();
      app.render();
    
      window.requestAnimationFrame(loop);
    }
    
    loop();
  }
}

const app = new DrawingApp();
app.start();