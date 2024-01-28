import { Scene } from "./Scenes/IScene";
import { InputManager } from "./Input";
import { CardBoardScene } from "./Scenes/CardBoardScene";
import { SceneManager } from "./Scenes/SceneManager";
import { AudioManager } from "./audio";
import { PointAndClick } from "./Scenes/PointAndClick";
import AssetManager from "./AssetManager";
import { Card } from "./Scenes/CardboardScene/Card";
import DeckManager from "./DeckManager";
import GameContext from "./GameContext";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private gameContext: GameContext;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;

    this.gameContext = new GameContext(
      new SceneManager(null),
      new AudioManager(),
      new AssetManager(),
      new DeckManager(),
      new InputManager(this.canvas)
    );

    this.gameContext.audioManager.init()

    this.loadAssets()
  }

  loadAssets() {
    const assetLoad = [
      this.gameContext.assetManager.loadImages([
        "sketch.png",
        "sketch_hover.png",
        "sketch_atk.png",
        "hourglass.png",
        "button.png",
        "button_hover.png",
      ]),
      this.gameContext.assetManager.loadData("cards.json")
        .then(() => {
          const cards = this.gameContext.assetManager.data<Array<Card>>("cards.json");

          this.gameContext.deckManager.init(cards);

          const map: {[k: string]: string} = {};

          cards.forEach(card => map[card.slug] = "cards/" + card.image);

          return this.gameContext.assetManager.loadImageMap(map, "cards");
        }),
    ];

    Promise.all(assetLoad)
      .then(() => {
        this.gameContext.sceneManager.pushScreen(new PointAndClick(this.gameContext));
        this.gameContext.sceneManager.getActiveScreen()?.load();
      })
  }

  update(delta:number) {
    this.gameContext.sceneManager.update(this.gameContext.inputManager.input, delta)
    this.gameContext.inputManager.update();
  }

  render() {
    this.context
      .clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameContext.sceneManager.render(this.context, this.gameContext.inputManager.input)
  }

  start() {
    let lastTime = 0;

    const loop = (time: DOMHighResTimeStamp) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      app.update(delta);
      app.render();

      window.requestAnimationFrame(loop);
    }

    loop(lastTime);
  }
}

const app = new DrawingApp();
app.start();
