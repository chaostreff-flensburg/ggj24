import { Input } from '../../Input';
import { CardInstance } from './CardInstance';
import { CARD_WIDTH, CARD_HEIGHT, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, INTER_CARD_PADDING, CANVAS_HEIGHT } from './Constants';

export class Field {
  private isOpponent: Boolean;
  private cards: Array<CardInstance | null> = [null, null, null, null, null];

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };
  selectedCard: CardInstance | null = null;

  private hoverYOffset: number = 0;

  cardBackground: HTMLImageElement | undefined;
  cardHover: HTMLImageElement | undefined;
  cardAtk: HTMLImageElement | undefined;

  onClick: ((card: CardInstance) => Boolean) | undefined;

  constructor(isOpponent: Boolean = false) {
    this.isOpponent = isOpponent;

    this.hoverYOffset = ((this.isOpponent) ? (-CARD_HEIGHT / 4) : (CARD_HEIGHT / 4))
  }

  addCard(card: CardInstance): Boolean {
    let result = false;

    this.cards.every((item, index, list) => {
      if (item == null) {
        list[index] = card;

        result = true

        return false;
      }

      return true;
    })

    console.log(result);

    if (result) {
      card.isHovered = false;
      this.updateCardTargetPosition()
    };

    return result;
  }

  removeCard(instance: CardInstance): void {
    const index = this.cards.findIndex(item => item?.id == instance.id);
    this.cards[index] = null;

    if (this.selectedCard?.id == instance.id) {
      this.selectedCard = null;
    }

    this.updateCardTargetPosition();
  }

  hasFreeSlot(): Boolean {
    return this.cards.some(item => !item);
  }

  isEmpty(): Boolean {
    return this.cards.every(item => item == null);
  }

  endOfTurnUpdate() {
    this.cards.forEach((card:CardInstance|null) => {
      if (card == null) return;

      card.attackedThisRound = false;
      card.turnsOnField++;
    });
  }

  private updateCardTargetPosition(): void {
    this.cards.forEach((instance, index) => {
      if (instance == null) {
        return;
      }

      // if old position != new position with new index?
      const nextPositionX = 100 + index * (CARD_WIDTH + INTER_CARD_PADDING);
      const nextPositionY = (this.isOpponent) ? CANVAS_HEIGHT / 3 : CANVAS_HEIGHT / 3 * 2;
      if (instance.isHovered) {
        instance.target.y = nextPositionY + this.hoverYOffset;
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
    this.cards.forEach(instance => {
      instance?.animateInstance();
    });

    this.cards.forEach(instance => {
      if (instance == null) {
        return;
      }

      if (instance.isHover(input)) {
        if (!instance.isHovered) {
          // new hover
          instance.target.y -= this.hoverYOffset;
        }

        instance.isHovered = true;

        if (input.clicked) {

          if (this.onClick && this.onClick(instance)) {
            if (this.selectedCard === instance) {
              this.selectedCard = null;
            } else {
              this.selectedCard = instance;
            }
          }
        }
      } else {
        if (instance.isHovered) {
          // new end hover
          instance.target.y += this.hoverYOffset;
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
      if (this.cardBackground == undefined || this.cardHover == undefined || this.cardAtk == undefined || instance == null) {
        return;
      }

      context.save();
      context.translate(instance.position.x, instance.position.y);
      // rotate by 180 degrees if opponent
      if (this.isOpponent) {
        context.rotate(Math.PI);
      }
      context.translate(-CARD_WIDTH / 2, -CARD_HEIGHT / 2);

      context.drawImage(this.cardBackground!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      if (instance.isHovered) {
        context.drawImage(this.cardHover!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      }

      if (instance == this.selectedCard) {
        context.drawImage(this.cardAtk!, 0, 0, CARD_IMAGE_WIDTH, CARD_IMAGE_HEIGHT, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      }

      // text
      context.fillStyle = "black";
      context.textAlign = "center";
      context.fillText(instance.card.title, CARD_WIDTH / 2, CARD_HEIGHT / 10);

      // attack
      context.fillText("ATK:"+instance.attack.toString(), CARD_WIDTH / 2.6, CARD_HEIGHT / 1.095);
      // defense
      context.fillText("DEF:"+instance.defense.toString(), CARD_WIDTH / 1.7, CARD_HEIGHT / 1.095);

      context.restore();
    });
  }
}
