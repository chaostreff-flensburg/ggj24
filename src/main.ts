import { Scene } from "./Scenes/IScene";
import { InputManager } from "./Input";
import { CardBoardScene } from "./Scenes/CardBoardScene";
import { SceneManager } from "./Scenes/SceneManager";
import { AudioManager } from "./audio";
import { PointAndClick } from "./Scenes/PointAndClick";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private sceneManager: SceneManager;
  private scene: Scene;

  private inputManager: InputManager;

  private audioManager: AudioManager;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;

    this.inputManager = new InputManager(this.canvas);

    this.audioManager = new AudioManager()
    this.audioManager.init()

    this.scene = new PointAndClick();
    this.scene.load();
    this.sceneManager = new SceneManager(this.scene)
  }

  update() {
    this.sceneManager.update(this.inputManager.input)
    this.inputManager.update();
  }

  render() {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.scene.render(this.context)
    this.sceneManager.render(this.context, this.inputManager.input)
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
