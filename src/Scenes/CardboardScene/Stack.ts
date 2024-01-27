import { Input } from "../../Input";
import { CardInstance } from "./CardInstance";
import { Hand } from "./Hand";
import { Point } from "./Point";

const CARD_IMAGE_WIDTH = 520;
const CARD_IMAGE_HEIGHT = 680;

const CARD_WIDTH = 300 / 2;
const CARD_HEIGHT = 380 / 2;

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1280;

export class Stack {
  private isOpponent: Boolean;
  private deck: Array<CardInstance> = [];

  cardBack: HTMLImageElement | undefined;

  hand: Hand;

  position: Point = {
    x: (CANVAS_WIDTH - CARD_WIDTH - 30),
    y: (CANVAS_HEIGHT - CARD_HEIGHT - 10)
  };
  topCardPosition: Point;
  target: Point;
  isHovered: boolean = false;

  public onClick: (() => void) | undefined;

  constructor(hand: Hand, isOpponent: Boolean = false) {
    this.hand = hand;
    this.isOpponent = isOpponent;

    if (isOpponent) {
      this.position.y = CARD_HEIGHT - 10;
    }

    this.target = { x: this.position.x, y: this.position.y };
    this.topCardPosition = { x: this.position.x, y: this.position.y };
  }

  shuffle(): void {
    this.deck.sort(() => Math.random() - 0.5);
  }

  draw(): CardInstance | undefined {
    if (this.deck.length === 0) {
      return;
    }

    const card = this.deck.pop();

    if (card) {
      card.position.x = this.position.x;
      card.position.y = this.position.y;
    }

    return card;
  }

  putCardBackToTop(card: CardInstance): void {
    this.deck.push(card);
  }

  update(input: Input): void {
    // animate
    if (this.target.x != this.topCardPosition.x || this.target.y != this.topCardPosition.y) {
      const distanceX = this.target.x - this.topCardPosition.x;
      const distanceY = this.target.y - this.topCardPosition.y;

      const speed = 5;
      this.topCardPosition.x += distanceX / speed;
      this.topCardPosition.y += distanceY / speed;
    }

    // is mouse over a card?
    if (input.x > this.position.x - CARD_WIDTH / 2 && input.x < this.position.x + CARD_WIDTH / 2 && input.y > this.position.y - CARD_WIDTH / 2 && input.y < this.position.y + CARD_WIDTH / 2) {
      if (!this.isHovered) {
        // new hover
        this.target.x -= 20;
      }

      this.isHovered = true;

      if (input.clicked && this.onClick) {
        this.onClick()
        input.clicked = false;
      }
    } else {
      if (this.isHovered) {
        // new end hover
        this.target.x += 20;
      }
      this.isHovered = false;
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.cardBack) {
      return;
    }

    this.deck.forEach((_, index) => {
      context.save();
      if (index === this.deck.length - 1) {
        context.translate(this.topCardPosition.x + index / 2, this.topCardPosition.y + index / 2);
      } else {
        context.translate(this.position.x + index / 2, this.position.y + index / 2);
      }

      // rotate by 180 degrees if opponent
      if (this.isOpponent) {
        context.rotate(Math.PI);
      }

      context.translate(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);

      context.drawImage(this.cardBack!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      context.restore();
    })
  }
}
