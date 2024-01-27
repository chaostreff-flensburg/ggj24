import { Card } from "./Card";
import { CardInstance } from "./CardInstance";
import { Hand } from "./Hand";

export class Stack {
  cards: Array<Card> = [];
  deck: Array<CardInstance> = [];

  hand: Hand;

  constructor(hand: Hand) {
    this.hand = hand;
  }

  async load(): Promise<void> {
    const self = this;

    // create deck instances
    this.cards.forEach((card, index) => {
      for (let i = 0; i < 10; i++) {
        this.deck.push(new CardInstance(card));
      }
    });

    // shuffle deck
    this.shuffle();

    console.log("stack loaded", this.deck.length)

    return ;
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
