import { Input } from "../Input";

export interface Scene {
  load(): void;
  update(input: Input): void;
  render(context: CanvasRenderingContext2D): void;
}
