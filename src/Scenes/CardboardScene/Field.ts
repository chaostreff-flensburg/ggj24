import { Input } from '../../Input';
import { CardInstance } from './CardInstance';
import { Point } from './Point';

const CARD_IMAGE_WIDTH = 300;
const CARD_IMAGE_HEIGHT = 380;

const CARD_WIDTH = CARD_IMAGE_WIDTH / 2;
const CARD_HEIGHT = CARD_IMAGE_HEIGHT / 2;

const INTER_CARD_PADDING = 20;
const CANVAS_HEIGHT = 800;

const ZOOM = 1.2;

export class Field {
  private cards: Array<CardInstance | null> = [null, null, null, null, null];

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  cardBackground: HTMLImageElement | undefined;

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
        instance.targetScale = ZOOM;
      } else {
        instance.target.y = nextPositionY;
        instance.targetScale = 1;
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

      if (instance.scale != instance.targetScale) {
        const distance = instance.targetScale - instance.scale;
        const speed = 10;
        instance.scale += distance / speed;
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

      if (input.x > x && input.x < x + CARD_WIDTH && input.y > y && input.y < y + CARD_HEIGHT) {
        if (!instance.isHovered) {
          // new hover
          instance.target.y -= CARD_HEIGHT / 4;
          instance.targetScale = ZOOM;
        }

        instance.isHovered = true;

        if (input.clicked) {
          //attack
        }
      } else {
        if (instance.isHovered) {
          // new end hover
          instance.target.y += CARD_HEIGHT / 4;
          instance.targetScale = 1;
        }

        instance.isHovered = false;
      }
    });
  }

  render(context: CanvasRenderingContext2D) {
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
      context.scale(instance.scale, instance.scale);

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
