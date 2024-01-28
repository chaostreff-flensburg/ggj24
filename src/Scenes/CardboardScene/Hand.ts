import { Input } from "../../Input";
import { CardInstance } from "./CardInstance";
import { Field } from "./Field";
import { CARD_WIDTH, CARD_HEIGHT, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, INTER_CARD_PADDING } from './Constants';

export class Hand {
  private isOpponent: Boolean;
  private cards: Array<CardInstance> = [];

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  private hoverYOffset: number = 0;

  private maxCards: number = 8;

  cardBackground: HTMLImageElement | undefined;
  cardHover: HTMLImageElement | undefined;
  cardImages: Map<string, HTMLImageElement> = new Map();

  onClick: ((card:CardInstance) => void) | undefined;

  constructor(isOpponent: Boolean = false) {
    this.isOpponent = isOpponent;
    this.hoverYOffset = ((this.isOpponent) ? (-CARD_HEIGHT / 3) : (CARD_HEIGHT / 3))
  }

  addCard(card: CardInstance): Boolean {
    let result = false;

    if (this.cards.length < this.maxCards) {
      card.isHovered = false;

      this.cards.push(card);
      this.updateCardTargetPosition();

      return true;
    }

    return result;
  }

  discard(instance: CardInstance): void {
    this.removeCard(instance);
    this.updateCardTargetPosition();
    // send card to graveyard
    // todo: this.graveyard.push(instance);
  }

  removeCard(instance: CardInstance): void {
    this.cards = this.cards.filter((item) => {
      return item.id != instance.id;
    });

    this.updateCardTargetPosition();
  }

  private updateCardTargetPosition(): void {
    let padding = INTER_CARD_PADDING;
    if (this.cards.length > 6) {
      padding -= (this.cards.length - 1) * 12;
    } else if (this.cards.length > 5) {
      padding -= (this.cards.length - 1) * 8;
    }

    this.cards.forEach((instance, index) => {
      // if old position != new position with new index?
      const nextPositionX = 100 + index * (CARD_WIDTH + padding);
      const nextPositionY = (this.isOpponent) ? (0 - CARD_HEIGHT/5) : (this.screenSize.height - CARD_HEIGHT / 6);
      if (instance.isHovered) {
        instance.target.y = nextPositionY + this.hoverYOffset;
      }

      if (instance.position.x != nextPositionX || instance.position.y != nextPositionY) {
        instance.target.x = nextPositionX;
        instance.target.y = nextPositionY;
      }
    });
  }

  update(input: Input, delta: number) {
    // position
    this.cards.forEach(instance => {
      instance?.animateInstance(delta);
    });

    // hover
    let cursorOnCard = false;
    // reverse loop
    for (let i = this.cards.length - 1; i >= 0; i--) {
      const instance = this.cards[i];
      if (instance == null) {
        return;
      }

      if (!cursorOnCard && instance.isHover(input)) {
        if (!instance.isHovered) {
          // new hover
          instance.target.y -= this.hoverYOffset;
        }

        instance.isHovered = true;

        if (input.clicked && this.onClick) {
          this.onClick(instance);
          input.clicked = false;
        }

        cursorOnCard = true;
      } else {
        if (instance.isHovered) {
          // new end hover
          instance.target.y += this.hoverYOffset;
        }
        instance.isHovered = false;
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (this.screenSize.width == 0 || this.screenSize.height == 0) {
      this.screenSize.width = context.canvas.width;
      this.screenSize.height = context.canvas.height;
      this.updateCardTargetPosition();
    }

    this.cards.forEach((instance) => {
      if (this.cardBackground == undefined || this.cardHover == undefined || instance == null) {
        return;
      }

      context.save();
      context.translate(instance.position.x, instance.position.y);
      // rotate by 180 degrees if opponent
      if (this.isOpponent) {
        context.rotate(Math.PI);
      }
      context.translate(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);

      if (! this.cardImages.has(instance.card.slug)) {
        context.drawImage(this.cardBackground!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      } else {
        context.drawImage(this.cardImages.get(instance.card.slug)!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      }

      if (instance.isHovered) {
        context.drawImage(this.cardHover!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      }

      // text
      context.font = "bold 9px sans-serif";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, CARD_WIDTH / 2, CARD_HEIGHT / 10);

      context.font = "bold 14px sans-serif";
      context.fillText(instance.attack.toString() + " / " + instance.defense.toString(), CARD_WIDTH / 2, CARD_HEIGHT / 1.095);

      context.restore();
    });
  }
}
