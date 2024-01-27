import { Scene } from "./IScene";
import { Input } from "../Input";

type Card = {
  title: string;
  description: string;
  slug: string;
  defense: number;
  attack: number;
}

type CardInstance = {
  id: number;
  card: Card;
  x: number;
  y: number;
  defense: number;
  attack: number;
  isHovered: boolean;
}

// CardDeck is a class that represents a deck of cards
export class CardDeck {
  cards: Array<Card> = [];
  deck: Array<CardInstance> = [];
  hand: Array<CardInstance> = [];
  graveyard: Array<CardInstance> = [];
  field: Array<CardInstance> = [];

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
              x: 0,
              y: 0,
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

        // todo: remove
        for (let i = 0; i < 10; i++) {
          self.draw();
        }

        // todo: remove
        let playNum = 5
        if (self.hand.length < 5) {
          playNum = self.hand.length;
        }
        for (let i = 0; i < playNum; i++) {
          self.play(self.hand[i]);
        }
      });
  }

  draw(): CardInstance | undefined {
    if (this.deck.length === 0) {
      return;
    }

    const card = this.deck.pop();
    if (card) {
      this.hand.push(card);
    }

    return card;
  }

  discard(instance: CardInstance): void {
    this.hand = this.hand.filter((c) => c.id !== instance.id);
    this.graveyard.push(instance);
  }

  play(instance: CardInstance): void {
    if (instance === undefined) {
      console.error("CARD IS UNDEFINED!")
      return;
    }

    this.hand = this.hand.filter((c) => c.id !== instance.id);
    this.field.push(instance);
  }

  attack(instance: CardInstance, target: CardInstance): void {
    target.defense -= instance.attack;
    instance.defense -= target.attack;

    if (target.defense <= 0) {
      this.defeat(target);
    }

    if (instance.defense <= 0) {
      this.defeat(instance);
    }
  }

  defeat(instance: CardInstance): void {
    this.field = this.field.filter((c) => c.id !== instance.id);
    this.graveyard.push(instance);
  }

  visibleCardInstances(): Array<CardInstance> {
    return this.hand.concat(this.field);
  }
}

// CardBoardScene is a class that represents the game scene
export class CardBoardScene implements Scene {
  private playerCardDeck: CardDeck = new CardDeck();
  private cardLoadComplete: boolean = false;

  private cardBackground: HTMLImageElement | null = null;
  private cardBackgroundLoadComplete = false;

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  // load scene image and points of interest
  load(): void {
    this.cardBackground = new Image();
    this.cardBackground.src = "card_background.png";
    this.cardBackground.onload = () => {
      this.cardBackgroundLoadComplete = true;
    };

    this.playerCardDeck.load().then(() => {
      this.cardLoadComplete = true;
    });
  }

  // update scene
  update(input: Input): void {
    if (!this.cardLoadComplete && !this.cardBackgroundLoadComplete) {
      return;
    }

    const cardWidth = 300 / 2;
    const cardHeight = 380 / 2;

    // is mouse over a card?
    this.playerCardDeck.field.forEach((instance, index) => {
      const x = instance.x;
      const y = instance.y;

      if (input.x > x && input.x < x + cardWidth && input.y > y && input.y < y + cardHeight) {
        instance.isHovered = true;
      } else {
        instance.isHovered = false;
      }
    });

    this.playerCardDeck.hand.forEach((instance, index) => {
      const x = instance.x;
      const y = instance.y;

      if (input.x > x && input.x < x + cardWidth && input.y > y && input.y < y + cardHeight) {
        instance.isHovered = true;

        if (input.clicked) {
          this.playerCardDeck.play(instance);
        }
      } else {
        instance.isHovered = false;
      }
    });
  }

  // render scene
  render(context: CanvasRenderingContext2D): void {
    if (!this.cardLoadComplete && !this.cardBackgroundLoadComplete) {
      return;
    }

    context.font = "bold 8px serif";

    this.screenSize.width = context.canvas.width;
    this.screenSize.height = context.canvas.height;

    // render background
    // render this.playerCardDeck.field
    // render this.playerCardDeck.graveyard
    // render this.playerCardDeck.hand

    const cardBackgroundWidth = this.cardBackground!.width;
    const cardBackgroundHeight = this.cardBackground!.height;

    const cardWidth = 300 / 2;
    const cardHeight = 380 / 2;

    const handPositionY = context.canvas.height - 100;
    const handPositionX = context.canvas.width / 2 - this.playerCardDeck.hand.length * 100 / 2;
    const paddingCardsField = 20;

    this.playerCardDeck.field.forEach((instance, index) => {
      const x = 100 + index * (cardWidth + paddingCardsField);
      const y = context.canvas.height / 2 - cardHeight/2;

      // todo: move for animation or ...
      instance.x = x;
      instance.y = y;

      if (instance.isHovered) {
        context.fillStyle = "yellow";
      } else {
        context.fillStyle = "gray";
      }
      context.fillRect(x, y, cardWidth, cardHeight);
      context.drawImage(this.cardBackground!, 0, 0, cardBackgroundWidth, cardBackgroundHeight, x, y, cardWidth, cardHeight);

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, x + cardWidth / 2, y + cardHeight / 10);

      // attack
      context.fillText(instance.attack.toString(), x + cardWidth / 4.5, y + cardHeight / 1.28);
      // defense
      context.fillText(instance.defense.toString(), x + cardWidth / 1.3, y + cardHeight / 1.28);
    });

    const paddingCardsHand = 20;
    this.playerCardDeck.hand.forEach((instance, index) => {
      const x = handPositionX + index * (100 + paddingCardsHand);
      const y = handPositionY;

      // todo: move for animation or ...
      instance.x = x;
      instance.y = y;

      if (instance.isHovered) {
        context.fillStyle = "yellow";
      } else {
        context.fillStyle = "gray";
      }
      context.fillRect(x, y, cardWidth, cardHeight);
      context.drawImage(this.cardBackground!, 0, 0, cardBackgroundWidth, cardBackgroundHeight, x, y, cardWidth, cardHeight);

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, x + cardWidth / 2, y + cardHeight / 10);

      // attack
      context.fillText(instance.attack.toString(), x + cardWidth / 4.5, y + cardHeight / 1.28);
      // defense
      context.fillText(instance.defense.toString(), x + cardWidth / 1.3, y + cardHeight / 1.28);
    });
  }
}
