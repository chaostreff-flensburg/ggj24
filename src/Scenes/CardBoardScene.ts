import { Scene } from "./IScene";
import { Input } from "../Input";
import { Card } from "./CardboardScene/Card";
import { CardInstance } from "./CardboardScene/CardInstance";
import { Field } from "./CardboardScene/Field";
import { Hand } from "./CardboardScene/Hand";
import { Stack } from "./CardboardScene/Stack";
import loadImage from "../loadImage";
import GameStateMachine from "./CardboardScene/GameStateMachine";

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

  private stateMachine: GameStateMachine = new GameStateMachine();

  private loadComplete: Boolean = false;

  private cardBackground: HTMLImageElement | undefined;
  private goodCardBack: HTMLImageElement | undefined;
  private sadCardBack: HTMLImageElement | undefined;

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  constructor() {
    this.playerField = new Field(this, false);
    this.playerHand = new Hand(this.playerField);
    this.playerStack = new Stack(this.playerHand);

    this.opponentField = new Field(this, true);
    this.opponentField.opponentField = this.playerField;
    this.opponentHand = new Hand(this.opponentField, true);
    this.opponentStack = new Stack(this.opponentHand, true);

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

    for (let i = 0; i < 5; i++) {
      this.playerHand.addCard(this.playerStack.draw()!);
      this.opponentHand.addCard(this.opponentStack.draw()!);
    }

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
  }

  onCardClicked(field: Field, card: CardInstance | null = null) {
    if (field.isOpponent && card != null && this.playerSelectedCard != null) {
      // attack ...!

      this.playerField.attack(this.playerSelectedCard!, card);
      this.playerSelectedCard = null;
      return;
    }

    if (field.isOpponent) {
      return;
    }

    if (this.playerSelectedCard === card) {
      this.playerSelectedCard = null;
      return;
    }

    this.playerSelectedCard = card;
  }
}
