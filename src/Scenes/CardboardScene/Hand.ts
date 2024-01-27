import { Input } from "../../Input";
import { CardInstance } from "./CardInstance";
import { Field } from "./Field";
import { Point } from "./Point";

const CARD_IMAGE_WIDTH = 300;
const CARD_IMAGE_HEIGHT = 380;

const CARD_WIDTH = CARD_IMAGE_WIDTH / 2;
const CARD_HEIGHT = CARD_IMAGE_HEIGHT / 2;

const INTER_CARD_PADDING = 20;
const CANVAS_HEIGHT = 800;

export class Hand {
  private cards: Array<CardInstance> = [];
  private field: Field;

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  cardBackground: HTMLImageElement|undefined;

  constructor(field: Field) {
    this.field = field;
  }

  addCard(card: CardInstance): Boolean {
    let result = false;

    card.target = this.calculateCardCoordinates(1);
    this.cards.push(card);

    return result;
  }

  private calculateCardCoordinates(index: number): Point {
    return {
      x: 100 + index * (CARD_WIDTH + INTER_CARD_PADDING),
      y: CANVAS_HEIGHT / 2,
    };
  }

  discard(instance: CardInstance): void {
    this.removeCard(instance);
    // send card to graveyard
    // todo: this.graveyard.push(instance);
  }

  play(instance: CardInstance): void {
    this.removeCard(instance);
    // send card to field
    this.field.addCard(instance);
  }

  private removeCard(instance: CardInstance): void {
    this.cards = this.cards.filter((item) => {
      return item.id != instance.id;
    });
  }

  update(input: Input) {
    // position
    this.cards.forEach((instance, index) => {
      if (instance == null) {
        return;
      }

      // if old position != new position with new index?
      const nextPositionX = 100 + index * (CARD_WIDTH + INTER_CARD_PADDING);
      const nextPositionY = this.screenSize.height - CARD_HEIGHT*0.5;
      if (instance.position.x != nextPositionX || instance.position.y != nextPositionY) {
        instance.target.x = nextPositionX;
        instance.target.y = nextPositionY;
      }

      if (instance.target.x == instance.position.x && instance.target.y == instance.position.y) {
        instance.position.x = 100 + index * (CARD_WIDTH + INTER_CARD_PADDING);
        instance.position.y = this.screenSize.height - CARD_HEIGHT*0.5;
        return
      }

      const distanceX = instance.target.x - instance.position.x;
      const distanceY = instance.target.y - instance.position.y;

      const speed = 2;
      instance.position.x += distanceX / speed;
      instance.position.y += distanceY / speed;
    });

    // hover
    this.cards.forEach((instance) => {
      if (instance == null) {
        return;
      }

      const x = instance.position.x;
      const y = instance.position.y;

      if (input.x > x && input.x < x + CARD_WIDTH && input.y > y && input.y < y + CARD_HEIGHT) {
        instance.isHovered = true;

        if (input.clicked) {
          this.play(instance)
        }
      } else {
        instance.isHovered = false;
      }
    });
  }

  render(context: CanvasRenderingContext2D) {
    this.screenSize.width = context.canvas.width;
    this.screenSize.height = context.canvas.height;

    this.cards.forEach((instance) => {
      if (this.cardBackground == undefined || instance == null) {
        return;
      }

      if (instance.isHovered) {
        context.fillStyle = "yellow";
        context.fillRect(instance.position.x-5, instance.position.y-5, CARD_WIDTH+10, CARD_HEIGHT+10);
      }
      context.drawImage(this.cardBackground!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, instance.position.x, instance.position.y, CARD_WIDTH, CARD_HEIGHT);

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, instance.position.x + CARD_WIDTH / 2, instance.position.y + CARD_HEIGHT / 10);

      // attack
      context.fillText(instance.attack.toString(), instance.position.x + CARD_WIDTH / 4.5, instance.position.y + CARD_HEIGHT / 1.28);
      // defense
      context.fillText(instance.defense.toString(), instance.position.x + CARD_WIDTH / 1.3, instance.position.y + CARD_HEIGHT / 1.28);
    });
  }
}
