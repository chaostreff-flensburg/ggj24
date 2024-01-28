import { Scene } from "./Scenes/IScene";
import { InputManager } from "./Input";
import { CardBoardScene } from "./Scenes/CardBoardScene";
import { SceneManager } from "./Scenes/SceneManager";
import { AudioManager } from "./audio";
import { PointAndClick } from "./Scenes/PointAndClick";
import AssetManager from "./AssetManager";
import { Card } from "./Scenes/CardboardScene/Card";
import DeckManager from "./DeckManager";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private sceneManager: SceneManager;

  private inputManager: InputManager;

  private audioManager: AudioManager;

  private assetManager: AssetManager;

  private deckManager: DeckManager|undefined;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;

    this.inputManager = new InputManager(this.canvas);
    this.assetManager = new AssetManager();
    this.audioManager = new AudioManager()
    this.audioManager.init()

    this.sceneManager = new SceneManager(null)

    this.loadAssets()
  }

  loadAssets() {
    const assetLoad = [
      this.assetManager.loadImages([
        "sketch.png",
        "sketch_hover.png",
        "sketch_atk.png",
        "hourglass.png",
        "button.png",
        "button_hover.png",
      ]),
      this.assetManager.loadData("cards.json")
        .then(() => {
          const cards = this.assetManager.data<Array<Card>>("cards.json");

          this.deckManager = new DeckManager(cards);
          this.deckManager.init();

          const map: {[k: string]: string} = {};

          cards.forEach(card => map[card.slug] = "cards/" + card.image);

          return this.assetManager.loadImageMap(map, "cards");
        }),
    ];

    Promise.all(assetLoad)
      .then(() => {
        this.sceneManager.pushScreen(new CardBoardScene(this.audioManager, this.sceneManager, this.assetManager, this.deckManager!));
        this.sceneManager.getActiveScreen()?.load();
      })
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
