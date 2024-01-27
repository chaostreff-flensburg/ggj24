export enum GameState {
  PLAYER_TURN_START,
  PLAYER_TURN_MAIN,
  OPPONENT_TURN_START,
  OPPONENT_TURN_MAIN,
};

export default class GameStateMachine {
  currentState: GameState = GameState.PLAYER_TURN_START;

  advanceState(): GameState {
    switch (this.currentState) {
      case GameState.PLAYER_TURN_START:
        this.currentState = GameState.PLAYER_TURN_MAIN;
        break;

      case GameState.PLAYER_TURN_MAIN:
        this.currentState = GameState.OPPONENT_TURN_START;
        break;

      case GameState.OPPONENT_TURN_START:
        this.currentState = GameState.OPPONENT_TURN_MAIN;

      case GameState.OPPONENT_TURN_MAIN:
        this.currentState = GameState.PLAYER_TURN_START;
        break;
    }

    return this.currentState;
  }

  isPlayerTurn(): Boolean {
    return this.currentState == GameState.PLAYER_TURN_START
      || this.currentState == GameState.PLAYER_TURN_MAIN;
  }

  playerCanDraw(): Boolean {
    return this.currentState == GameState.PLAYER_TURN_START;
  }

  opponentCanDraw(): Boolean {
    return this.currentState == GameState.OPPONENT_TURN_START;
  }

  playerCanAct(): Boolean {
    return this.currentState == GameState.PLAYER_TURN_MAIN;
  }

  opponentCanAct(): Boolean {
    return this.currentState == GameState.OPPONENT_TURN_MAIN;
  }
}
