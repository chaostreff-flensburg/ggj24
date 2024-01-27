import { CardInstance } from "./CardInstance";
import { Hand } from "./Hand";

const CARD_IMAGE_WIDTH = 520;
const CARD_IMAGE_HEIGHT = 680;

const CARD_WIDTH = 300 / 2;
const CARD_HEIGHT = 380 / 2;

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 1280;

export class Stack {
  deck: Array<CardInstance> = [];

  cardBack: HTMLImageElement | undefined;

  hand: Hand;

  constructor(hand: Hand) {
    this.hand = hand;
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
      this.hand.addCard(card);
    }

    return card;
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.cardBack) {
      return;
    }

    this.deck.forEach((_, index) => {
      context.drawImage(this.cardBack!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, (CANVAS_WIDTH - CARD_WIDTH - 70) + index / 2, (CANVAS_HEIGHT - CARD_HEIGHT - 30) - index / 2, CARD_WIDTH, CARD_HEIGHT);
    })
  }
}
