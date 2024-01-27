import { Card } from "./Card";
import { Point } from "./Point";

export type CardInstance = {
  id: number;
  card: Card;
  position: Point;
  target: Point;
  defense: number;
  attack: number;
  isHovered: boolean;
}
