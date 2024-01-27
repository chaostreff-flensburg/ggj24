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

  cardBackground: HTMLImageElement|undefined;

  constructor(field: Field) {
    this.field = field;
  }

  addCard(card: CardInstance): Boolean {
    let result = false;

    card.target = this.calculateCardCoordinates(1);
    card.position = card.target;
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
    this.cards.forEach((instance, index) => {
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
    this.cards.forEach((instance, index) => {
      if (this.cardBackground == undefined || instance == null) {
        return;
      }

      const x = 100 + index * (CARD_WIDTH + INTER_CARD_PADDING);
      const y = context.canvas.height - CARD_HEIGHT*0.5;

      // todo: move for animation or ...
      instance.position.x = x;
      instance.position.y = y;

      if (instance.isHovered) {
        context.fillStyle = "yellow";
      } else {
        context.fillStyle = "gray";
      }
      context.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
      context.drawImage(this.cardBackground!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, x + CARD_WIDTH / 2, y + CARD_HEIGHT / 10);

      // attack
      context.fillText(instance.attack.toString(), x + CARD_WIDTH / 4.5, y + CARD_HEIGHT / 1.28);
      // defense
      context.fillText(instance.defense.toString(), x + CARD_WIDTH / 1.3, y + CARD_HEIGHT / 1.28);
    });
  }
}
