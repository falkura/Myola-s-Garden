import anime from "animejs";
import { Config } from "./Config";
import { Clickable } from "./TMCore/Clickable";
import { Drop } from "./TMCore/Drop";
import Tile from "./TMCore/Tile";
import TiledMap from "./TMCore/TiledMap";
import { iDrop, iPlant } from "./TMCore/TMModel";

export class Plant extends Clickable {
    isGrown = false;
    needUpdate = true;
    plantTime: number;
    animations: PIXI.Texture[] = [];
    cell: Tile;

    data: iPlant;
    dropData: iDrop;

    constructor(id: number, mapData: TiledMap, tile: Tile) {
        super(
            Config.plants[id],
            mapData.getTileset(Config.plants[id].tileset)!,
            mapData
        );
        this.data = Config.plants[id];

        this.cell = tile;
        this.dropData = Config.drops[this.data.drop];

        if (this.data.animation) {
            this.animations.push(this.tileset.textures[this.data.id]);
            this.data.animation.forEach((anim) => {
                this.animations.push(this.tileset.textures[anim]);
            });
        }

        if (this.animations.length === 0) {
            this.animations.push(this.tileset.textures[id]);
        }

        this.plantTime = new Date().getTime();
        this.mapData.plants.push(this);
    }

    update = () => {
        if (!this.needUpdate) return;
        const time =
            this.data.growTime - (new Date().getTime() - this.plantTime);

        if (!this.isGrown) {
            if (time <= 0) {
                this.description.time = "grown";
                this.isGrown = true;
            } else {
                const textureId =
                    this.animations.length -
                    Math.floor(
                        time / (this.data.growTime / this.animations.length)
                    );

                this.texture = this.animations[textureId - 1];

                const date = new Date(time);
                const sz = date.getSeconds() > 9 ? "" : "0";

                this.description.time = `${date.getMinutes()}:${sz}${date.getSeconds()}`;
            }
        } else {
            this.needUpdate = false;
            const filter = new PIXI.filters.ColorMatrixFilter();
            filter.saturate(0.5, true);
            this.filters = [filter];
            this.setOnClick(this.harvest);
        }

        if (this.is_hovered) {
            this.hoverEvent();
        }
        // console.log(this);
    };

    harvest = () => {
        const sprite = new Drop(this.dropData, this.mapData);

        sprite.zIndex = 3;
        sprite.anchor = this.anchor;
        sprite.x = this.parent.x;

        const targetY = this.parent.y;

        anime
            .timeline()
            .add({
                targets: sprite.scale,
                x: [0.8, 1],
                y: [0.8, 1],
                easing: "linear",
                duration: 100,
                complete: () => {
                    sprite.scale.set(1);
                },
            })
            .add({
                targets: sprite.position,
                y: [targetY - 6, targetY],
                easing: "linear",
                duration: 100,
                complete: () => {
                    sprite.y = targetY;
                },
            });

        this.cleanUp();
        this.cell.Dirt!.visible = true;

        this.mapData.addChild(sprite);
    };

    cleanUp = () => {
        this.mapData.plants.splice(this.mapData.plants.indexOf(this) - 1, 1);
        this.cell.removeChild(this);
        this.cell.Plant = undefined;

        this.destroy();
    };
}
