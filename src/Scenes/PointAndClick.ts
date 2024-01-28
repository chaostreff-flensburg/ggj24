import { Scene } from "./IScene";
import { Input } from "../Input";
import { PaKMenu } from "./PaKMenu";
import { AudioManager } from "../audio";
import { SceneManager } from "./SceneManager";
import AssetManager from "../AssetManager";
import GameContext from "../GameContext";

type PointOfInterest = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  actions?: Array<{ action: string; audio?: string, deck?: string }>;
  action?: string;
  fight?: boolean;
};

export class PointAndClick implements Scene {
  private image: HTMLImageElement | null = null;
  private imageLoadcomplete = false;
  private menu: PaKMenu = new PaKMenu();

  private pointofinterest: Map<string, Array<PointOfInterest>> = new Map();
  private moveable: Map<string, Array<PointOfInterest>> = new Map();
  private action: string | undefined;
  private imagescroll: string = "0";
  public debug: boolean = false;
  private charimage = new Image();
  private char1image = new Image();
  private char2image = new Image();
  private charX: number = 75;
  private charY: number = 480;
  private charTargetX: number = 75;
  private charTargetY: number = 480;
  private cant_do_cnt: number = 0;
  private last_action: string = "";

  private audioManager: AudioManager;
  private sceneManager: SceneManager;
  private assetManager: AssetManager;

  private gameContext: GameContext;

  constructor(context: GameContext, imagescroll: string = "0", charX: number = 75, charY: number = 480) {
    this.gameContext = context;

    this.audioManager = context.audioManager;
    this.sceneManager = context.sceneManager;
    this.audioManager = context.audioManager;
    this.assetManager = context.assetManager;
    this.imagescroll = imagescroll;
    this.charX = charX;
    this.charY = charY;
    this.charTargetX = charX;
    this.charTargetY = charY;
  }

  // load scene image and points of interest
  load(): void {
    // load scene image
    this.image = new Image();
    this.image.src = "scene/scene1.png";
    this.image.onload = () => {
      this.imageLoadcomplete = true;
    };
    this.charimage.src = "scene/char1.png";
    this.char1image.src = "scene/char2.png";
    this.char2image.src = "scene/char3.png";

    // 4 points of interest
    this.pointofinterest = new Map(Object.entries({
      0: [
        {
          x1: 580,
          x2: 660,
          y1: 400,
          y2: 550,
          actions: [{
            action: "look",
            audio: "door-closed-1",
          }],
        },
        {
          x1: 250,
          x2: 300,
          y1: 430,
          y2: 550,
          actions: [{
            action: "look",
            audio: "door-closed-1",
          }],
        },
        {
          x1: 1230,
          x2: 1280,
          y1: 480,
          y2: 600,
          actions: [{
            action: "look",
            audio: "stand-there-1",
          }, { action: "talk", audio: "ready-1", deck: "deck1" }],
        },
      ],
      1: [
        {
          x1: 900,
          x2: 965,
          y1: 330,
          y2: 450,
          actions: [{
            action: "look",
            audio: "door-closed-1",
          }],
        },
        {
          x1: 1230,
          x2: 1280,
          y1: 480,
          y2: 600,
          actions: [{
            action: "look",
            audio: "stand-there-1",
          }, { action: "talk", audio: "ready-1", deck: "deck2" }],
        },
      ],
    }));

    this.moveable = new Map(Object.entries({
      0: [
        {
          x1: 100,
          x2: 1280,
          y1: 550,
          y2: 600,
        },
        {
          x1: 200,
          x2: 300,
          y1: 500,
          y2: 550,
        },
        {
          x1: 1230,
          x2: 1280,
          y1: 550,
          y2: 600,
          action: "moveup",
          fight: true,
        },
      ],
      1: [
        {
          x1: 50,
          x2: 1280,
          y1: 550,
          y2: 600,
        },
        {
          x1: 0,
          x2: 50,
          y1: 550,
          y2: 600,
          action: "movedown",
          fight: false,
        },
        {
          x1: 1230,
          x2: 1280,
          y1: 550,
          y2: 600,
          action: "moveup",
          fight: true,
        }
      ],
    }));

    this.menu.load();
  };

  // update scene
  update(input: Input, delta: number): void {
    // animation
    if (this.charX !== this.charTargetX && this.charY !== this.charTargetY) {
      const distanceX = this.charTargetX - this.charX;
      const distanceY = this.charTargetY - this.charY;

      const speed = 3 * delta;
      this.charX += distanceX * speed;
      this.charY += distanceY * speed;
    }

    // interaction
    /* console.log('update', input) */
    let playedSound = false;
    if (input.clicked === true) {
      this.pointofinterest.get(this.imagescroll)?.forEach(
        (
          point: PointOfInterest,
        ) => {
          if (
            input.x > point.x1 && input.y > point.y1 && input.x < point.x2 &&
            input.y < point.y2
          ) {
            if (this.menu.action !== "") {
              let matchingActions = point.actions?.filter((action) => this.menu.action === action.action);

              if (matchingActions && matchingActions.length > 0) {
                matchingActions.forEach((action) => {
                  if (action.audio) {
                    this.audioManager.playSound(action.audio);
                    playedSound = true;
                    if(action.action === "talk" && action.audio === "ready-1" && action.deck)
                    {
                      this.sceneManager.startFight(this.gameContext, action.deck, this.imagescroll, this.charX, this.charY);
                      this.moveable.get(this.imagescroll)?.filter((poi) => poi.action === "moveup").forEach((poi) => {
                        poi.fight = false;
                      });
                      action.audio = "dont-talk-1";
                    }
                  }
                });
              } else {
                // cant do that
                if (this.cant_do_cnt < 5) {
                  this.audioManager.playSound("cant-do-1");
                  if (this.last_action !== this.menu.action) {
                    this.last_action = this.menu.action;
                    this.cant_do_cnt = 0;
                  }
                  else
                    this.cant_do_cnt++;
                }
                else {
                  if (this.last_action !== this.menu.action) {
                    this.last_action = this.menu.action;
                    this.cant_do_cnt = 0;
                    this.audioManager.playSound("cant-do-1");
                  }
                  else {
                    if (this.cant_do_cnt < 10) {
                      this.audioManager.playSound("cant-do-x");
                      this.cant_do_cnt++;
                    }
                    else
                      this.audioManager.playSound("cant-do-max");
                  }
                }
                playedSound = true;
              }
              this.menu.action = ""; // reset action
            }
          }
        },
      );
      if (playedSound === false) {
        this.moveable.get(this.imagescroll)?.forEach(
          (
            point: PointOfInterest,
          ) => {
            if (
              input.x > point.x1 && input.y > point.y1 && input.x < point.x2 &&
              input.y < point.y2
            ) {
              // move image scroll
              if (point.action === "movedown" && point.fight !== true) {
                console.log("movedown");
                this.imagescroll = (parseInt(this.imagescroll) - 1).toString();
                this.charX = input.x - 48 + 1200;
                this.charY = input.y - 115;
              }
              else
              if (point.action === "moveup" && point.fight !== true) {
                console.log("moveup");
                this.imagescroll = (parseInt(this.imagescroll) + 1).toString();
                this.charX = input.x - 48 - 1200;
                this.charY = input.y - 115;
              }
              this.charTargetX = input.x - 48;
              this.charTargetY = input.y - 115;
            }
          },
        );
      }
    }
    this.menu.update(input);
  }

  // render scene
  render(context: CanvasRenderingContext2D, input: Input): void {
    if (this.imageLoadcomplete) {
      // draw char image
      context.drawImage(this.image!, -1280 * parseInt(this.imagescroll), 0);
      if(this.imagescroll === "0")
      {
        context.drawImage(this.char1image!, 1200, 480, 90, 110);
      }
      if(this.imagescroll === "1")
      {
        context.drawImage(this.char2image!, 1215, 480, 60, 120);
      }
      context.drawImage(this.charimage, this.charX, this.charY, 100, 120);
      this.menu.render(context, input);
      if (this.debug) { // for debugging
        this.pointofinterest.get(this.imagescroll)?.forEach((poi) => {
          context.strokeStyle = "green";
          context.strokeRect(poi.x1, poi.y1, poi.x2 - poi.x1, poi.y2 - poi.y1);
        });
        this.moveable.get(this.imagescroll)?.forEach((poi) => {
          context.strokeStyle = "red";
          context.strokeRect(poi.x1, poi.y1, poi.x2 - poi.x1, poi.y2 - poi.y1);
        });
      }
    }
  }
}
