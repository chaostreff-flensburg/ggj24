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

  onClick: ((card:CardInstance) => void) | undefined;

  constructor(isOpponent: Boolean = false) {
    this.isOpponent = isOpponent;
    this.hoverYOffset = ((this.isOpponent) ? (-CARD_HEIGHT / 4) : (CARD_HEIGHT / 4))
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
    if (this.cards.length > 8) {
      padding -= (this.cards.length - 1) * 8;
    } else if (this.cards.length > 5) {
      padding -= (this.cards.length - 1) * 5;
    }

    this.cards.forEach((instance, index) => {
      // if old position != new position with new index?
      const nextPositionX = 100 + index * (CARD_WIDTH + padding);
      const nextPositionY = (this.isOpponent) ? (0 - CARD_HEIGHT / 10) : (this.screenSize.height - CARD_HEIGHT / 6);
      if (instance.isHovered) {
        instance.target.y = nextPositionY + this.hoverYOffset;
      }

      if (instance.position.x != nextPositionX || instance.position.y != nextPositionY) {
        instance.target.x = nextPositionX;
        instance.target.y = nextPositionY;
      }
    });
  }

  update(input: Input) {
    // position
    this.cards.forEach((instance, index) => {
      instance?.animateInstance();
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
      if (this.cardBackground == undefined || instance == null) {
        return;
      }

      context.save();
      context.translate(instance.position.x, instance.position.y);
      // rotate by 180 degrees if opponent
      if (this.isOpponent) {
        context.rotate(Math.PI);
      }
      context.translate(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);

      if (instance.isHovered) {
        context.fillStyle = "yellow";
        context.fillRect(- 5, - 5, CARD_WIDTH + 10, CARD_HEIGHT + 10);
      }
      context.drawImage(this.cardBackground!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, CARD_WIDTH / 2, CARD_HEIGHT / 10);

      // attack
      context.fillText("ATK:" + instance.attack.toString(), CARD_WIDTH / 2.6, CARD_HEIGHT / 1.095);
      // defense
      context.fillText("DEF:" + instance.defense.toString(), CARD_WIDTH / 1.7, CARD_HEIGHT / 1.095);

      context.restore();
    });
  }
}
