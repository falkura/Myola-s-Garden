import anime from "animejs";
import TiledMap from "../TMCore/TiledMap";
import { calculateCoordinate } from "../Util";
import { Clickable } from "./Clickable";
import { Seed } from "./Seed";
import { EVENTS } from "../Events";
import { Plants } from "../Config/Plants";

export class SeedOption extends PIXI.Sprite {
    mapData: TiledMap;
    sprites: Clickable[] = [];
    is_shown = false;
    private current_anim?: anime.AnimeInstance;

    constructor(mapData: TiledMap) {
        super();
        this.mapData = mapData;
        this.interactive = true;

        const circle = new PIXI.Graphics()
            .beginFill(0x333333, 0.4)
            .drawCircle(0, 0, this.mapData.source.tilewidth * 2)
            .beginHole()
            .drawCircle(0, 0, this.mapData.source.tilewidth)
            .endFill();

        this.addChild(circle);
        this.scale.set(0);
    }

    show = () => {
        this.completeAnim();

        this.current_anim = anime({
            targets: this.scale,
            x: 1,
            y: 1,
            easing: "linear",
            duration: 100,
            complete: () => {
                this.scale.set(1);
            },
        });
    };

    hide = () => {
        this.completeAnim();

        this.current_anim = anime({
            targets: this.scale,
            x: 0,
            y: 0,
            easing: "linear",
            duration: 100,
            complete: () => {
                this.scale.set(0);
                for (const sprite of this.sprites) {
                    this.removeChild(sprite);
                }
                this.sprites = [];
            },
        });
    };

    completeAnim = () => {
        if (this.current_anim && this.current_anim.complete) {
            this.current_anim.pause();
            this.current_anim.complete(this.current_anim);
        }
    };

    drawOptions = () => {
        this.show();

        return new Promise<number>((resolve) => {
            const listener = () => {
                this.hide();
                resolve(NaN);
                document.removeEventListener("mousedown", listener);
            };

            document.addEventListener("mousedown", listener);

            const coords = calculateCoordinate(
                Plants.plants.length,
                this.mapData.source.tilewidth * 1.5,
                0,
                0
            );

            for (let i = 0; i < coords.length; i++) {
                const item = new Seed(Plants.plants[i], this.mapData);

                item.sprite.anchor.set(0.5, 0.5);
                item.sprite.addListener("mousedown", () => {
                    resolve(i);
                    item.sprite.is_hovered = false;
                    document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
                });

                item.sprite.position.set(coords[i].x, coords[i].y);

                this.sprites.push(item.sprite);
            }

            this.addChild(...this.sprites);
        });
    };
}
