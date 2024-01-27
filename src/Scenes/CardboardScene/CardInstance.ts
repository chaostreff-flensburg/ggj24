import { Card } from "./Card";
import { Point } from "./Point";

let CURRENT_ID = 0;

export class CardInstance {
  id: number = ++CURRENT_ID;
  card: Card;
  position: Point = {x: 0, y: 0};
  target: Point = {x: 0, y: 0};
  defense: number = 0;
  attack: number = 0;
  isHovered: boolean = false;

  constructor(card: Card) {
    this.card = card;

    this.defense = card.defense;
    this.attack = card.attack;
  }

  animateInstance(): void {
    if (this.target.x == this.position.x && this.target.y == this.position.y) {
      return
    }

    const distanceX = this.target.x - this.position.x;
    const distanceY = this.target.y - this.position.y;

    const speed = 10;
    this.position.x += distanceX / speed;
    this.position.y += distanceY / speed;
  }
}
