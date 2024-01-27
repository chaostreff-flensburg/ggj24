import { Input } from "../../Input";
import { CardInstance } from "./CardInstance";
import { Hand } from "./Hand";

const CARD_IMAGE_WIDTH = 520;
const CARD_IMAGE_HEIGHT = 680;

const CARD_WIDTH = 300 / 2;
const CARD_HEIGHT = 380 / 2;

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1280;

export class Stack {
  private isOpponent: Boolean;
  deck: Array<CardInstance> = [];

  cardBack: HTMLImageElement | undefined;

  hand: Hand;

  position: { x: number, y: number } = {
    x: (CANVAS_WIDTH - CARD_WIDTH - 30),
    y: (CANVAS_HEIGHT - CARD_HEIGHT - 10)
  };

  public onClick: (() => void)|undefined;

  constructor(hand: Hand, isOpponent: Boolean = false) {
    this.hand = hand;
    this.isOpponent = isOpponent;

    if (isOpponent) {
      this.position.y = CARD_HEIGHT - 10;
    }
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

  update(input: Input): void {
    // is mouse over a card?
    if (input.x > this.position.x && input.x < this.position.x + CARD_WIDTH && input.y > this.position.y && input.y < this.position.y + CARD_HEIGHT) {
      if (input.clicked && this.onClick) {
        this.onClick()
        input.clicked = false;
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.cardBack) {
      return;
    }

    this.deck.forEach((_, index) => {
      context.save();
      context.translate(this.position.x + index / 2, this.position.y+ index / 2);

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
