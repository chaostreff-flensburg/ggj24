export type Input = {
  x: number;
  y: number;
  clicked: Boolean;
}

export class InputManager {
  input: Input;

  constructor(canvas: HTMLCanvasElement) {
    this.input = {
      x: 0,
      y: 0,
      clicked: false
    };

    canvas.addEventListener('click', (event: MouseEvent) => this.mouseClick(event))
    canvas.addEventListener('mousemove', (event: MouseEvent) => this.mouseMove(event))
  }

  mouseClick(event: MouseEvent) {
    this.input.x = event.offsetX;
    this.input.y = event.offsetY;
    this.input.clicked = true;
  }

  mouseMove(event: MouseEvent) {
    this.input.x = event.offsetX;
    this.input.y = event.offsetY;
  }

  update() {
    this.input.clicked = false;
  }
}
