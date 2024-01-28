import { Scene } from "./IScene";
import { Input } from "../Input";
import { CardInstance } from "./CardboardScene/CardInstance";
import { Field } from "./CardboardScene/Field";
import { Hand } from "./CardboardScene/Hand";
import { Stack } from "./CardboardScene/Stack";
import GameStateMachine from "./CardboardScene/GameStateMachine";
import { AudioManager } from "../audio";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./CardboardScene/Constants";
import { Point } from "./CardboardScene/Point";
import { SceneManager } from "./SceneManager";
import AssetManager from "../AssetManager";
import GameContext from "../GameContext";

// CardBoardScene is a class that represents the game scene
export class CardBoardScene implements Scene {
  private playerStack: Stack;
  private opponentStack: Stack;
  private playerHand: Hand;
  private opponentHand: Hand;
  private playerField: Field;
  private opponentField: Field;

  private playerLifePoints: number = 1000;
  private opponentLifePoints: number = 1000;

  private stateMachine: GameStateMachine = new GameStateMachine();

  public debug: boolean = false;

  private buttonImage: HTMLImageElement | undefined;
  private buttonImageHover: HTMLImageElement | undefined;

  private screenSize: { width: number, height: number } = { width: 0, height: 0 };

  private playerButtonPosition: Point = {
    x: CANVAS_WIDTH - 90,
    y: CANVAS_HEIGHT / 1.68
  }
  private opponentButtonPosition: Point = {
    x: CANVAS_WIDTH - 240,
    y: CANVAS_HEIGHT / 2.5
  }

  private audioManager: AudioManager;
  private sceneManager: SceneManager;
  private assetManager: AssetManager;

  constructor({audioManager, sceneManager, assetManager, deckManager}: GameContext, opponentKey:string = 'opponent') {
    this.audioManager = audioManager;
    this.sceneManager = sceneManager;
    this.assetManager = assetManager;

    this.playerField = new Field();
    this.playerHand = new Hand();
    this.playerStack = new Stack(deckManager.getFreshPlayerDeck());

    this.opponentField = new Field(true);
    this.opponentHand = new Hand(true);
    this.opponentStack = new Stack(deckManager.getFreshOpponentDeck(opponentKey), true);
  }

  load(): void {
    this.playerHand.cardBackground = this.opponentField.cardBackground = this.opponentHand.cardBackground = this.playerField.cardBackground = this.playerStack.cardBackground = this.opponentStack.cardBackground = this.assetManager.image("sketch.png");
    this.playerField.cardAtk = this.opponentField.cardAtk = this.assetManager.image("sketch_atk.png");
    this.playerField.cardHourglass = this.opponentField.cardHourglass = this.assetManager.image("hourglass.png");

    this.playerHand.cardHover = this.playerField.cardHover = this.opponentField.cardHover = this.opponentHand.cardHover = this.assetManager.image("sketch_hover.png");
    this.playerHand.cardImages = this.playerField.cardImages = this.opponentHand.cardImages = this.opponentField.cardImages = this.assetManager.imageMap("cards");

    this.buttonImage = this.assetManager.image('button.png');
    this.buttonImageHover = this.assetManager.image('button_hover.png')

    this.prepareDeck();
    this.prepareHands();
    this.prepareFields();

    this.stateMachine.onTurnAdvance = () => {
      const result = this.checkBattleOverDeckSize();

      this.audioManager.playSound("your-turn");

      this.handleGameEnd(result);
    }
  }

  private prepareDeck() {
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

      if (
        this.stateMachine.opponentCanAct()
        && this.opponentField.selectedCard?.canAttack()
        && this.playerField.isEmpty()
      ) {
        this.opponentField.selectedCard.attackedThisRound = true;
        this.reducePlayerLifePoints(this.opponentField.selectedCard.attack);
        const res = this.checkBattleOverLifePoints();
        this.handleGameEnd(res);
      }

      if (this.stateMachine.playerCanDraw()) this.stateMachine.advanceState();
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

      if (
        this.stateMachine.playerCanAct()
        && this.playerField.selectedCard?.canAttack()
        && this.opponentField.isEmpty()
      ) {
        this.playerField.selectedCard.attackedThisRound = true;
        this.reduceOpponentLifePoints(this.playerField.selectedCard.attack);
        const res = this.checkBattleOverLifePoints();
        this.handleGameEnd(res);
      }

      if (this.stateMachine.opponentCanDraw()) this.stateMachine.advanceState();
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

      if (this.opponentField.selectedCard?.canAttack()) {
        const passOn = this.resolveBattle(this.opponentField.selectedCard, card);

        if (this.opponentField.selectedCard.defense <= 0) {
          this.opponentField.removeCard(this.opponentField.selectedCard)
        }

        if (card.defense <= 0) {
          this.playerField.removeCard(card)
        }

        this.reduceOpponentLifePoints(passOn.x);
        this.reducePlayerLifePoints(passOn.y);

        const res = this.checkBattleOverLifePoints();
        this.handleGameEnd(res);
      }

      return false;
    }

    this.opponentField.onClick = (card: CardInstance): Boolean => {
      if (this.stateMachine.opponentCanAct()) {
        return true;
      }

      if (this.playerField.selectedCard?.canAttack()) {
        const passOn = this.resolveBattle(this.playerField.selectedCard, card);

        if (this.playerField.selectedCard.defense <= 0) {
          this.playerField.removeCard(this.playerField.selectedCard)
        }

        if (card.defense <= 0) {
          this.opponentField.removeCard(card)
        }

        this.reducePlayerLifePoints(passOn.x);
        this.reduceOpponentLifePoints(passOn.y);

        const res = this.checkBattleOverLifePoints();
        this.handleGameEnd(res);
      }

      return false;
    }
  }

  private checkClickEndTurn(input: Input): void {
    if (!input.clicked) {
      return;
    }

    if (this.stateMachine.playerCanAct() && input.x > this.playerButtonPosition.x - 150 && input.x < this.playerButtonPosition.x && input.y > this.playerButtonPosition.y - 50 && input.y < this.playerButtonPosition.y) {
      this.stateMachine.advanceState();
      this.opponentField.endOfTurnUpdate();
    }

    if (this.stateMachine.opponentCanAct() && input.x > this.opponentButtonPosition.x && input.x < this.opponentButtonPosition.x + 150 && input.y > this.opponentButtonPosition.y && input.y < this.opponentButtonPosition.y + 50) {
      this.stateMachine.advanceState();
      this.playerField.endOfTurnUpdate();
    }
  }

  resolveBattle(card1: CardInstance, card2: CardInstance): Point {
    card2.defense -= card1.attack;
    card1.defense -= card2.attack;

    card1.attackedThisRound = true;

    return {
      x: Math.min(card1.defense, 0),
      y: Math.min(card2.defense, 0),
    };
  }

  private reducePlayerLifePoints(value: number): void {
    this.playerLifePoints = Math.max(this.playerLifePoints - Math.abs(value), 0);
  }

  private reduceOpponentLifePoints(value: number): void {
    this.opponentLifePoints = Math.max(this.opponentLifePoints - Math.abs(value), 0);
  }

  private checkBattleOverLifePoints(): Boolean | null | undefined {
    const opponent = this.opponentLifePoints <= 0;
    const player = this.playerLifePoints <= 0;

    if (opponent && player) {
      return null;
    }

    if (opponent) {
      return true;
    }

    if (player) {
      return false
    }
  }

  private checkBattleOverDeckSize(): Boolean | null | undefined {
    const opponent = this.opponentStack.isEmpty();
    const player = this.playerStack.isEmpty();

    if (opponent && player) {
      return null;
    }

    if (opponent) {
      return true;
    }

    if (player) {
      return false
    }
  }

  private handleGameEnd(result: Boolean | null | undefined): void {
    if (result === undefined) {
      return;
    }

    if (result === null) {
      console.log('TIE');
      return;
    }

    if (result) {
      console.log('PLAYER WON');
      return;
    }

    console.log('OPPONENT WON');
  }

  // update scene
  update(input: Input): void {
    this.playerStack.update(input);
    this.playerHand.update(input);
    this.playerField.update(input);

    this.opponentStack.update(input);
    this.opponentHand.update(input);
    this.opponentField.update(input);

    this.checkClickEndTurn(input);
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
    this.screenSize.width = context.canvas.width;
    this.screenSize.height = context.canvas.height;

    this.playerStack.render(context);
    this.playerField.render(context, input);
    this.playerHand.render(context);

    this.opponentStack.render(context);
    this.opponentField.render(context, input);
    this.opponentHand.render(context);

    context.font = "bold 16px sans-serif";
    context.fillText(`LIFEPOINTS: ${this.playerLifePoints}`, CANVAS_WIDTH - 240, CANVAS_HEIGHT - 50);
    context.fillText(`LIFEPOINTS: ${this.opponentLifePoints}`, CANVAS_WIDTH - 240, 50);

    // player button
    if (this.stateMachine.playerCanAct()) {
      context.save();
      context.translate(this.playerButtonPosition.x, this.playerButtonPosition.y);
      context.translate(-150, -50);
      if (input.x > this.playerButtonPosition.x - 150 && input.x < this.playerButtonPosition.x && input.y > this.playerButtonPosition.y - 50 && input.y < this.playerButtonPosition.y) {
        context.drawImage(this.buttonImageHover!, 0, 0, 300, 100, 0, 0, 150, 50);
      } else {
        context.drawImage(this.buttonImage!, 0, 0, 300, 100, 0, 0, 150, 50);
      }
      context.fillText(`End Turn`, 150 / 4, 50 / 1.6);
      context.restore();
    }

    if (this.stateMachine.opponentCanAct()) {
      // opponent button
      context.save();
      context.translate(this.opponentButtonPosition.x, this.opponentButtonPosition.y);
      context.rotate(Math.PI);
      context.translate(-150, -50);
      if (input.x > this.opponentButtonPosition.x && input.x < this.opponentButtonPosition.x + 150 && input.y > this.opponentButtonPosition.y && input.y < this.opponentButtonPosition.y + 50) {
        context.drawImage(this.buttonImageHover!, 0, 0, 300, 100, 0, 0, 150, 50);
      } else {
        context.drawImage(this.buttonImage!, 0, 0, 300, 100, 0, 0, 150, 50);
      }
      context.fillText(`End Turn`, 150 / 4, 50 / 1.6);
      context.restore();
    }
  }
}
