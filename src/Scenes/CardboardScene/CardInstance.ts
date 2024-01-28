import { Card } from "./Card";
import { CARD_HEIGHT, CARD_WIDTH } from "./Constants";
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
  turnsOnField: number = 0;
  attackedThisRound: Boolean = false;

  constructor(card: Card) {
    this.card = card;

    this.defense = card.defense;
    this.attack = card.attack;
  }

  canAttack(): Boolean {
    return this.turnsOnField >= 1
      && !this.attackedThisRound;
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

  isHover(cursor: Point): boolean {
    return (cursor.x > this.position.x - CARD_WIDTH / 2 && cursor.x < this.position.x + CARD_WIDTH / 2 && cursor.y > this.position.y - CARD_HEIGHT / 2 - (this.isHovered?10:0) && cursor.y < this.position.y + CARD_HEIGHT / 2 + (this.isHovered?10:0))
  }
}
