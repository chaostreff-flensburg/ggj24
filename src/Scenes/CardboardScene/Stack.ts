import { CardInstance } from "./CardInstance";
import { Hand } from "./Hand";

export class Stack {
  deck: Array<CardInstance> = [];

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
  }
}
