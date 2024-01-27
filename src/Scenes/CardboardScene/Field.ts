import { Input } from '../../Input';
import { CardInstance } from './CardInstance';
import { CARD_WIDTH, CARD_HEIGHT, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, INTER_CARD_PADDING, CANVAS_HEIGHT } from './Constants';
import { Point } from './Point';

export class Field {
  private isOpponent: Boolean;
  private cards: Array<CardInstance | null> = [null, null, null, null, null];

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };
  private selectedCard: CardInstance | null = null;

  cardBackground: HTMLImageElement | undefined;

  constructor(isOpponent: Boolean = false) {
    this.isOpponent = isOpponent;
    console.log("isOpponent", isOpponent);
  }

  addCard(card: CardInstance): Boolean {
    let result = false;

    card.isHovered = false;

    this.cards.every((item, index, list) => {
      if (item == null) {
        list[index] = card;

        result = true

        return false;
      }

      return true;
    })

    console.log(result);
    this.updateCardTargetPosition();

    return result;
  }

  isFreeSlot(): Boolean {
    return this.cards.some((item) => {
      return item == null;
    });
  }

  private updateCardTargetPosition(): void {
    this.cards.forEach((instance, index) => {
      if (instance == null) {
        return;
      }

      // if old position != new position with new index?
      const nextPositionX = 100 + index * (CARD_WIDTH + INTER_CARD_PADDING);
      const nextPositionY = CANVAS_HEIGHT / 2;
      if (instance.isHovered) {
        instance.target.y = nextPositionY - CARD_HEIGHT / 4;
      } else {
        instance.target.y = nextPositionY;
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
      if (instance == null) {
        return;
      }

      if (instance.target.x == instance.position.x && instance.target.y == instance.position.y) {
        return
      }

      const distanceX = instance.target.x - instance.position.x;
      const distanceY = instance.target.y - instance.position.y;

      const speed = 10;
      instance.position.x += distanceX / speed;
      instance.position.y += distanceY / speed;
    });

    this.cards.forEach((instance, index) => {
      if (instance == null) {
        return;
      }

      const x = instance.position.x;
      const y = instance.position.y;

      if (input.x > x - CARD_WIDTH / 2 && input.x < x + CARD_WIDTH / 2 && input.y > y - CARD_HEIGHT / 2 && input.y < y + CARD_HEIGHT / 2) {
        if (!instance.isHovered) {
          // new hover
          instance.target.y -= CARD_HEIGHT / 4;
        }

        instance.isHovered = true;

        if (input.clicked) {
          if (this.selectedCard === instance) {
            this.selectedCard = null;
          } else {
            this.selectedCard = instance;
          }
        }
      } else {
        if (instance.isHovered) {
          // new end hover
          instance.target.y += CARD_HEIGHT / 4;
        }

        instance.isHovered = false;
      }
    });
  }

  render(context: CanvasRenderingContext2D, input: Input) {
    if (this.screenSize.width == 0 || this.screenSize.height == 0) {
      this.screenSize.width = context.canvas.width;
      this.screenSize.height = context.canvas.height;
      this.updateCardTargetPosition();
    }

    this.cards.forEach((instance, index) => {
      if (this.cardBackground == undefined || instance == null) {
        return;
      }

      context.save();
      context.translate(instance.position.x, instance.position.y);
      context.translate(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);

      if (instance == this.selectedCard) {
        context.fillStyle = "red";
        context.fillRect(-5, -5, CARD_WIDTH + 10, CARD_HEIGHT + 10);
      }

      if (instance.isHovered) {
        context.fillStyle = "yellow";
        context.fillRect(-5, -5, CARD_WIDTH + 10, CARD_HEIGHT + 10);
      }
      context.drawImage(this.cardBackground!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, CARD_WIDTH / 2, CARD_HEIGHT / 10);

      // attack
      context.fillText(instance.attack.toString(), CARD_WIDTH / 4.5, CARD_HEIGHT / 1.28);
      // defense
      context.fillText(instance.defense.toString(), CARD_WIDTH / 1.3, CARD_HEIGHT / 1.28);

      context.restore();
    });
  }
}
