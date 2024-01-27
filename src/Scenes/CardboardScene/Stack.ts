import { Input } from "../../Input";
import { CardInstance } from "./CardInstance";
import { CARD_WIDTH, CARD_HEIGHT, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from './Constants';
import { Hand } from "./Hand";

export class Stack {
  private isOpponent: Boolean;
  deck: Array<CardInstance> = [];

  cardBack: HTMLImageElement | undefined;

  hand: Hand;

  position: { x: number, y: number } = {
    x: (CANVAS_WIDTH - CARD_WIDTH - 70),
    y: (CANVAS_HEIGHT - CARD_HEIGHT - 30)
  };

  constructor(hand: Hand, isOpponent: Boolean = false) {
    this.hand = hand;
    this.isOpponent = isOpponent;
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

      this.hand.addCard(card);
    }

    return card;
  }

  update(input: Input): void {
    // is mouse over a card?
    if (input.x > this.position.x && input.x < this.position.x + CARD_WIDTH && input.y > this.position.y && input.y < this.position.y + CARD_HEIGHT) {
      if (input.clicked) {
        console.log("draw card")
        this.draw();
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.cardBack) {
      return;
    }

    this.deck.forEach((_, index) => {
      context.drawImage(this.cardBack!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, this.position.x + index / 2, this.position.y - index / 2, CARD_WIDTH, CARD_HEIGHT);
    })
  }
}
