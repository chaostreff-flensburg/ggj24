import { DemoScene } from "./Scenes/DemoScene";
import { Scene } from "./Scenes/IScene";
import { InputManager } from "./Input";
import { CardBoardScene } from "./Scenes/CardBoardScene";
import { SceneManager } from "./Scenes/SceneManager";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private sceneManager: SceneManager;
  private scene: Scene;

  private inputManager: InputManager;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;

    this.inputManager = new InputManager(this.canvas);

    this.scene = new CardBoardScene();
    this.scene.load();
    this.sceneManager = new SceneManager(this.scene)

  }

  update() {
    //this.scene.update(this.inputManager.input);
    this.sceneManager.update(this.inputManager.input)
    this.inputManager.update();
  }

  render() {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.scene.render(this.context)
    this.sceneManager.render(this.context)
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