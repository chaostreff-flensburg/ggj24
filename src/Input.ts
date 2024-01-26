export type Input = {
    x:Number;
    y:Number;
    clicked:Boolean;
}


export class InputManager{
    input: Input;

    constructor(canvas:HTMLCanvasElement){
        this.input = {
            x: 0,
            y: 0,
            clicked: false
        };

        canvas.addEventListener('click', (event:MouseEvent) => this.mouseClick(event))
        canvas.addEventListener('mousemove', (event:MouseEvent) => this.mouseMove(event))
    }

    mouseClick(event:MouseEvent){
        console.log(this.input);
        this.input.x = event.offsetX;
        this.input.y = event.offsetY;
        this.input.clicked = true;

        console.log(this.input);
        
    }

    mouseMove(event:MouseEvent){
        console.log(this.input);
            this.input.x = event.offsetX;
            this.input.y = event.offsetY;

            console.log(this.input);
    }

    update() {
        this.input.clicked = false;
    }
}