import GameContext from "../GameContext";
import { Input } from "../Input";
import { CardBoardScene } from "./CardBoardScene";
import { Scene } from "./IScene"

/**
 * Manages those damn scenes
 */
export class SceneManager {
  // the scene that is visible
  private activeScene: Scene | null;
  // last scene that was active
  private lastScene: Scene | null = null
  private width: number = 0
  private height: number = 0
  // removes the scene automatically after it is not the active scene anymore
  private autoDispose: boolean = false

  constructor(initialScene: Scene | null = null) {
    this.activeScene = initialScene
  }

  /**
   * adds a scene to the activeScene variable
   * @param
   */
  pushScreen(s: Scene) {
    if (s) {
      this.lastScene = this.autoDispose ? null : this.activeScene
      this.activeScene = s
    } else {
      console.error("Cannot add scene. Scene was null")
    }
  }

  getActiveScreen(): Scene | null {
    return this.activeScene
  }

  getLastScene(): Scene | null {
    return this.lastScene
  }

  startFight(context: GameContext, deck: string, imageScroll: string, charX: number, charY: number) {
    this.pushScreen(new CardBoardScene(context, deck));
    this.activeScene?.load();
  }

  returnToLastScene() {
    this.activeScene = this.lastScene;
    this.lastScene = null;
  }

  // TODO pass width and height to resize function of scenes (if implemented)
  resize(w: number, h: number) {
    this.width = w
    this.height = h
  }

  render(context: CanvasRenderingContext2D, input: Input) {
    if (this.activeScene) {
      this.activeScene.render(context, input)
    }
  }

  update(input: Input, delta: number) {
    if (this.activeScene) {
      this.activeScene.update(input, delta)
    }
  }

}
