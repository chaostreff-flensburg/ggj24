import { Scene } from "./IScene";
import { Input } from "../Input";
import { Card } from "./CardboardScene/Card";
import { CardInstance } from "./CardboardScene/CardInstance";
import { Field } from "./CardboardScene/Field";
import { Hand } from "./CardboardScene/Hand";
import { Stack } from "./CardboardScene/Stack";

// CardBoardScene is a class that represents the game scene
export class CardBoardScene implements Scene {
  private stack: Stack;
  private hand: Hand;
  private field: Field = new Field();
  private cardLoadComplete: boolean = false;

  private cardBackground: HTMLImageElement | null = null;
  private cardBackgroundLoadComplete = false;

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  constructor() {
    this.hand = new Hand(this.field);
    this.stack = new Stack(this.hand);
  }

  // load scene image and points of interest
  load(): void {
    this.cardBackground = new Image();
    this.cardBackground.src = "card_background.png";
    this.cardBackground.onload = () => {
      this.cardBackgroundLoadComplete = true;
    };

    this.stack.load().then(() => {
      this.cardLoadComplete = true;
      this.field.cardBackground = this.cardBackground!;
      this.hand.cardBackground = this.cardBackground!;

      for (let i = 0; i < 5; i++) {
        this.stack.draw();
      }
    });
  }

  // update scene
  update(input: Input): void {
    if (!this.cardLoadComplete && !this.cardBackgroundLoadComplete) {
      return;
    }

    /*
    const cardWidth = 300 / 2;
    const cardHeight = 380 / 2;

    // is mouse over a card?
    this.playerCardDeck.field.forEach((instance, index) => {
      const x = instance.position.x;
      const y = instance.position.y;

      if (input.x > x && input.x < x + cardWidth && input.y > y && input.y < y + cardHeight) {
        instance.isHovered = true;
      } else {
        instance.isHovered = false;
      }
    });
    this.playerCardDeck.hand.forEach((instance, index) => {
      const x = instance.position.x;
      const y = instance.position.y;

      if (input.x > x && input.x < x + cardWidth && input.y > y && input.y < y + cardHeight) {
        instance.isHovered = true;

        if (input.clicked) {
          this.field.addCard(instance)
          //this.playerCardDeck.play(instance);
        }
      } else {
        instance.isHovered = false;
      }
    });
    */

    this.hand.update(input);
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
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

    /*
    const cardBackgroundWidth = this.cardBackground!.width;
    const cardBackgroundHeight = this.cardBackground!.height;

    const cardWidth = 300 / 2;
    const cardHeight = 380 / 2;

    const handPositionY = context.canvas.height - 100;
    const handPositionX = context.canvas.width / 2 - this.playerCardDeck.hand.length * 100 / 2;
    const paddingCardsField = 20;

    const paddingCardsHand = 20;
    this.playerCardDeck.hand.forEach((instance, index) => {
      const x = handPositionX + index * (100 + paddingCardsHand);
      const y = handPositionY;

      // todo: move for animation or ...
      instance.position.x = x;
      instance.position.y = y;

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
    */

    this.stack.render(context);
    this.field.render(context);
    this.hand.render(context);
  }
}
