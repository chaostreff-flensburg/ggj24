import { Scene } from "./IScene";
import { Input } from "../Input";

type Card = {
    title: string;
    description: string;
    slug: string;
    def: number;
    atk: number;
}

// CardDeck is a class that represents a deck of cards
export class CardDeck {
    cards: Array<Card> = [];
    hand: Array<Card> = [];
    graveyard: Array<Card> = [];
    field: Array<Card> = [];

    async load(): Promise<void> {
        return fetch("cards.json").then((response) => {
            response.json().then((data) => {
                this.cards = data.cards as Array<Card>;
            });
        });
    }

    draw(): Card {
        const card = this.cards.pop();
        if (card) {
            this.hand.push(card);
        }
        return card!;
    }

    discard(card: Card): void {
        this.hand = this.hand.filter((c) => c.slug !== card.slug);
        this.graveyard.push(card);
    }

    play(card: Card): void {
        this.hand = this.hand.filter((c) => c.slug !== card.slug);
        this.field.push(card);
    }

    attack(card: Card, target: Card): void {
        target.def -= card.atk;
        card.def -= target.atk;

        if (target.def <= 0) {
            this.defeat(target);
        }

        if (card.def <= 0) {
            this.defeat(card);
        }
    }

    defeat(card: Card): void {
        this.field = this.field.filter((c) => c.slug !== card.slug);
        this.graveyard.push(card);
    }
}

// CardBoardScene is a class that represents the game scene
export class CardBoardScene implements Scene {
    private playerCardDeck: CardDeck = new CardDeck();
    private cardLoadComplete: boolean = false;

    // load scene image and points of interest
    load(): void {
        this.playerCardDeck.load().then(() => {
            this.cardLoadComplete = true;
        });
    }

    // update scene
    update(input: Input): void {
        if (!this.cardLoadComplete) {
            return;
        }

        // on click at
        // round (draw, play, discard, attack, defeat)
    }

    // render scene
    render(context: CanvasRenderingContext2D): void {
        if (!this.cardLoadComplete) {
            return;
        }

        // render background
        // render this.playerCardDeck.field
        // render this.playerCardDeck.graveyard
        // render this.playerCardDeck.hand
    }
}