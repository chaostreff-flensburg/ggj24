import { Card } from "./Card";
import { Point } from "./Point";

let CURRENT_ID = 0;

export class CardInstance {
  id: number = ++CURRENT_ID;
  card: Card;
  position: Point = {x: 0, y: 0};
  scale: number = 1;
  target: Point = {x: 0, y: 0};
  targetScale: number = 1;
  defense: number = 0;
  attack: number = 0;
  isHovered: boolean = false;

  constructor(card: Card) {
    this.card = card;

    this.defense = card.defense;
    this.attack = card.attack;
  }
}
