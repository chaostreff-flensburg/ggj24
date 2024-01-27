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

    return fetch("cards.json")
      .then(response => response.json())
      .then((cards: Array<Card>) => {
        self.cards = cards

        // create deck instances
        let id = 0;
        self.cards.forEach((card, index) => {
          for (let i = 0; i < 10; i++) {
            let instance: CardInstance = {
              id: id,
              card: card,
              position: {
                x: 0,
                y: 0,
              },
              target: {
                x: 0,
                y: 0,
              },

              // set base defense and attack
              defense: card.defense,
              attack: card.attack,
              isHovered: false
            }

            self.deck.push(instance);
            id += 1;
          }
        });

        // shuffle deck
        self.deck.sort(() => Math.random() - 0.5);

        console.log("stack loaded", self.deck.length)
      });
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
