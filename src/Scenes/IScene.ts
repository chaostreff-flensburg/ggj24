import GameContext from "../GameContext";
import { Input } from "../Input";

export interface Scene {
  load(): void;
  update(input: Input, delta: number): void;
  render(context: CanvasRenderingContext2D, input: Input): void;
  debug: boolean;
}
