import { Character } from "@/game/base/Character";
import oie_transparent from "@/assets/images/lobby/oie_transparent.png";
import { Game, Menu } from "@/game";
import { SpeechBubble } from "../../Menu/SpeechBubble";
import { Shop } from "../../Menu/Shop";
import { ConfirmButton } from "@/game/Menu/ConfirmButton";

export class Npc extends Character {
  constructor() {
    super();
    this.type = "npc";
    this.animation.sx = 144;
    this.x = 320;
    this.y = 680;
  }

  private pontoEvento = [
    { x: -16, y: 16 },
    { x: 48, y: 16 },
    // { x: 16, y: 48 },
    // { x: 16, y: -48 },
  ];

  draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
  }

  public getPointEvent(): { x: number; y: number } {
    const pontoRomdom = Math.floor(Math.random() * this.pontoEvento.length);
    const ponto = this.pontoEvento[pontoRomdom];
    return { x: this.x + ponto.x, y: this.y + ponto.y };
  }

  public interaction(gameObject: Character): void {
    this.setLookAt(gameObject);

    const image = new Image();
    image.src = oie_transparent;
    image.onload = () => {
       /*const menu = new Menu({ timeOut: 5000 });
      const element = {
        type: "image",
        rectangle: SpeechBubble.rectangleDimesion("Hello, the Green Table is Battle Player vs Marvin and the another ones is Player vs Player!", this.x, this.y),
        draw: (context: any) => {
          SpeechBubble.draw(context, element.rectangle, "Hello, the Green Table is Battle Player vs Marvin and the another ones is Player vs Player!");
        },
      };
      menu.add(element);*/
      const menu = new Menu({ layer: "Global", isFocus: true });
      const shop = new Shop();
      menu.add(...shop.products);
     /* const confirmButton = new ConfirmButton("Skin Mario", 10);
      menu.add(...confirmButton.elements);*/
      menu.onClose = () => {
        this.isSelect = false;
      };
      Game.instance.addMenu(menu);
    };
  }
}