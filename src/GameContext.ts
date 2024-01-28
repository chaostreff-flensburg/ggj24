import AssetManager from "./AssetManager";
import DeckManager from "./DeckManager";
import { InputManager } from "./Input";
import { SceneManager } from "./Scenes/SceneManager"
import { AudioManager } from "./audio";

export default class GameContext {
  sceneManager: SceneManager;
  audioManager: AudioManager;
  assetManager: AssetManager;
  deckManager: DeckManager;
  inputManager: InputManager;

  constructor(
    sceneManager: SceneManager,
    audioManager: AudioManager,
    assetManager: AssetManager,
    deckManager: DeckManager,
    inputManager: InputManager
  ) {
    this.assetManager = assetManager;
    this.audioManager = audioManager;
    this.deckManager = deckManager;
    this.sceneManager = sceneManager;
    this.inputManager = inputManager;
  }
}
