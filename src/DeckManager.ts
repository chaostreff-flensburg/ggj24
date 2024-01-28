import { Card } from "./Scenes/CardboardScene/Card";
import { CardInstance } from "./Scenes/CardboardScene/CardInstance";

export default class DeckManager {
  private cards: Array<Card>;

  private playerDeck: Array<CardInstance> = [];

  opponentDecks: Map<string, Array<CardInstance>> = new Map();

  constructor(cards: Array<Card>) {
    this.cards = cards;
  }

  init() {
    this.playerDeck = [];
    const opponentDeck: Array<CardInstance> = [];

    this.cards.forEach((card) => {
      for (let i = 0; i < 2; i++) {
        this.playerDeck.push(new CardInstance(card));
        opponentDeck.push(new CardInstance(card));
      }
    });

    this.opponentDecks.set('opponent', opponentDeck);
  }

  getFreshPlayerDeck(): Array<CardInstance> {
    return this.playerDeck.map((card): CardInstance => {
      card.defense = card.card.defense;

      return card;
    })
  }

  getFreshOpponentDeck(opponentKey:string): Array<CardInstance> {
    return this.opponentDecks.get(opponentKey)!.map((card): CardInstance => {
      card.defense = card.card.defense;

      return card;
    })
  }
}
