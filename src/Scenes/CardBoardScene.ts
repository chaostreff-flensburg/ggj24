import { Scene } from "./IScene";
import { Input } from "../Input";
import { Card } from "./CardboardScene/Card";
import { CardInstance } from "./CardboardScene/CardInstance";
import { Field } from "./CardboardScene/Field";
import { Hand } from "./CardboardScene/Hand";
import { Stack } from "./CardboardScene/Stack";
import loadImage from "../loadImage";
import GameStateMachine from "./CardboardScene/GameStateMachine";
import { AudioManager } from "../audio";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./CardboardScene/Constants";
import { Point } from "./CardboardScene/Point";

// CardBoardScene is a class that represents the game scene
export class CardBoardScene implements Scene {
  private cards: Array<Card> = [];
  private playerStack: Stack;
  private opponentStack: Stack;
  private playerHand: Hand;
  private opponentHand: Hand;
  private playerField: Field;
  private opponentField: Field;
  private playerSelectedCard: CardInstance | null = null;

  private playerLifePoints: number = 1000;
  private opponentlifePoints: number = 1000;

  private stateMachine: GameStateMachine = new GameStateMachine();

  private loadComplete: Boolean = false;

  private cardBackground: HTMLImageElement | undefined;
  private goodCardBack: HTMLImageElement | undefined;
  private sadCardBack: HTMLImageElement | undefined;

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  private audioManager: AudioManager;

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager

    this.playerField = new Field();
    this.playerHand = new Hand();
    this.playerStack = new Stack();

    this.opponentField = new Field(true);
    this.opponentField.opponentField = this.playerField;
    this.opponentHand = new Hand(true);
    this.opponentStack = new Stack(true);

    this.playerField.opponentField = this.opponentField;
  }

  load(): void {
    const assetLoad = [
      loadImage("card_background.png")
        .then(image => this.cardBackground = image),
      loadImage("good_card_back.png")
        .then(image => this.goodCardBack = image),
      loadImage("sad_card_back.png")
        .then(image => this.sadCardBack = image),
      fetch("cards.json")
        .then(response => response.json())
        .then((cards: Array<Card>) => {
          this.cards = cards
        })
    ];

    Promise.all(assetLoad)
      .then(() => {
        this.loadComplete = true;
        this.playerField.cardBackground = this.cardBackground!;
        this.playerHand.cardBackground = this.cardBackground!;
        this.playerStack.cardBack = this.goodCardBack!;

        this.opponentField.cardBackground = this.cardBackground!;
        this.opponentHand.cardBackground = this.cardBackground!;
        this.opponentStack.cardBack = this.sadCardBack!;

        this.prepareDeck();
        this.prepareHands();
        this.prepareFields();
      })
  }

  private prepareDeck() {
    this.cards.forEach((card) => {
      for (let i = 0; i < 2; i++) {
        this.playerStack.putCardBackToTop(new CardInstance(card));
        this.opponentStack.putCardBackToTop(new CardInstance(card));
      }
    });

    this.playerStack.shuffle();
    this.opponentStack.shuffle();

    this.playerStack.onClick = () => {
      if (this.stateMachine.playerCanDraw()) {
        const card = this.playerStack.draw();

        if (card) {
          const res = this.playerHand.addCard(card);
          if (!res) {
            this.playerStack.putCardBackToTop(card);
          }
        }
      }

      if (this.stateMachine.isPlayerTurn()) this.stateMachine.advanceState();
    }

    this.opponentStack.onClick = () => {
      if (this.stateMachine.opponentCanDraw()) {
        const card = this.opponentStack.draw();

        if (card) {
          const res = this.opponentHand.addCard(card);
          if (!res) {
            this.opponentStack.putCardBackToTop(card);
          }
        }
      }

      if (this.stateMachine.isOpponentTurn()) this.stateMachine.advanceState();
    }
  }

  private prepareHands() {
    for (let i = 0; i < 5; i++) {
      this.playerHand.addCard(this.playerStack.draw()!);
      this.opponentHand.addCard(this.opponentStack.draw()!);
    }

    this.playerHand.onClick = (card: CardInstance) => {
      if (!this.stateMachine.playerCanAct()) {
        return;
      }

      if (this.playerField.addCard(card)) {
        this.playerHand.removeCard(card);
      }
    }

    this.opponentHand.onClick = (card: CardInstance) => {
      if (!this.stateMachine.opponentCanAct()) {
        return;
      }

      if (this.opponentField.addCard(card)) {
        this.opponentHand.removeCard(card);
      }
    }
  }

  private prepareFields() {
    this.playerField.onClick = (card: CardInstance): Boolean => {
      if (this.stateMachine.playerCanAct()) {
        this.audioManager.playSound("click5")
        return true;
      }

      if (this.opponentField.selectedCard) {
        const passOn = this.resolveBattle(this.opponentField.selectedCard, card);

        if (this.opponentField.selectedCard.defense <= 0) {
          this.opponentField.removeCard(this.opponentField.selectedCard)
        }

        if (card.defense <= 0) {
          this.playerField.removeCard(card)
        }

        this.opponentlifePoints += passOn.x;
        this.playerLifePoints += passOn.y;
      }

      return false;
    }

    this.opponentField.onClick = (card: CardInstance): Boolean => {
      if (this.stateMachine.opponentCanAct()) {
        return true;
      }

      if (this.playerField.selectedCard) {
        const passOn = this.resolveBattle(this.playerField.selectedCard, card);

        if (this.playerField.selectedCard.defense <= 0) {
          this.playerField.removeCard(this.playerField.selectedCard)
        }

        if (card.defense <= 0) {
          this.opponentField.removeCard(card)
        }

        this.playerLifePoints += passOn.x;
        this.opponentlifePoints += passOn.y;
      }

      return false;
    }
  }

  resolveBattle(card1: CardInstance, card2: CardInstance): Point {
    card2.defense -= card1.attack;
    card1.defense -= card2.attack;

    return {
      x: Math.min(card1.defense, 0),
      y: Math.min(card2.defense, 0),
    };
  }

  // update scene
  update(input: Input): void {
    if (!this.loadComplete) {
      return;
    }

    this.playerStack.update(input);
    this.playerHand.update(input);
    this.playerField.update(input);

    this.opponentStack.update(input);
    this.opponentHand.update(input);
    this.opponentField.update(input);
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
    if (!this.loadComplete) {
      return;
    }

    context.font = "bold 8px serif";

    this.screenSize.width = context.canvas.width;
    this.screenSize.height = context.canvas.height;

    this.playerStack.render(context);
    this.playerField.render(context, input);
    this.playerHand.render(context);

    this.opponentStack.render(context);
    this.opponentField.render(context, input);
    this.opponentHand.render(context);

    context.font = "bold 16px serif";
    context.fillText(`LIFEPOINTS: ${this.playerLifePoints}`, CANVAS_WIDTH - 240, CANVAS_HEIGHT - 50);
    context.fillText(`LIFEPOINTS: ${this.opponentlifePoints}`, CANVAS_WIDTH - 240, 50);
  }
}
