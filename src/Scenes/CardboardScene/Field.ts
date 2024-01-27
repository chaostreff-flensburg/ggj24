import { Input } from '../../Input';
import {CardInstance} from './CardInstance';
import { Point } from './Point';

const CARD_IMAGE_WIDTH = 300;
const CARD_IMAGE_HEIGHT = 380;

const CARD_WIDTH = CARD_IMAGE_WIDTH / 2;
const CARD_HEIGHT = CARD_IMAGE_HEIGHT / 2;

const INTER_CARD_PADDING = 20;
const CANVAS_HEIGHT = 800;

export class Field {
  private cards: Array<CardInstance|null> = [null, null, null, null, null];

  cardBackground: HTMLImageElement|undefined;

  addCard(card: CardInstance): Boolean {
    let result = false;

    this.cards.every((item, index, list) => {
      if (item == null) {
        card.target = this.calculateCardCoordinates(index);
        card.position = card.target;
        list[index] = card;

        result = true

        return false;
      }

      return true;
    })

    console.log(result);


    return result;
  }

  private calculateCardCoordinates(index: number): Point {
    return {
      x: 100 + index * (CARD_WIDTH + INTER_CARD_PADDING),
      y: CANVAS_HEIGHT / 2,
    };
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
          //attack
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
      const y = context.canvas.height / 2;

      // todo: move for animation or ...
      instance.position.x = x;
      instance.position.y = y;

      if (instance.isHovered) {
        context.fillStyle = "yellow";
        context.fillRect(x-5, y-5, CARD_WIDTH+10, CARD_HEIGHT+10);
      }
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
