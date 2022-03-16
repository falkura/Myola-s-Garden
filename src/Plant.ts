import anime from "animejs";
import { Config } from "./Config";
import { Drop } from "./TMCore/Drop";
import Tile from "./TMCore/Tile";
import TiledMap from "./TMCore/TiledMap";
import TileSet from "./TMCore/TileSet";
import { iPlantData } from "./TMCore/TMModel";
import { formatTime } from "./Util";
import { EVENTS } from "./Events";
import { Clickable } from "./Clickable";
import { WAILAData } from "./TMCore/WAILA";

export class Plant extends Clickable {
    isGrown = false;
    needUpdate = true;
    plantTime: number;
    animations: PIXI.Texture[] = [];
    cell: Tile;
    tileset!: TileSet;

    is_hovered = false;
    data: iPlantData;
    additionalData = "";
    mapData: TiledMap;

    constructor(id: number, mapData: TiledMap, tile: Tile) {
        super(
            mapData.getTileset(Config.plants[id].plant.tileset)!.textures[id]
        );
        this.data = Config.plants[id];
        this.mapData = mapData;
        this.cell = tile;
        this.tileset = mapData.getTileset(Config.plants[id].plant.tileset)!;
        // this.dropData = Config.drops[this.data.drop];

        if (this.data.plant.animation) {
            this.animations.push(this.tileset.textures[this.data.plant.id]);
            this.data.plant.animation.forEach((anim) => {
                this.animations.push(this.tileset.textures[anim]);
            });
        }

        if (this.animations.length === 0) {
            this.animations.push(this.tileset.textures[id]);
        }

        this.plantTime = new Date().getTime();
        this.mapData.plants.push({ time: this.plantTime, plant: this });

        this.addHover(this.additionalHover);
        this.addUnhover(this.additionalUnhover);
    }

    update = () => {
        if (!this.needUpdate) return;
        const time =
            this.data.plant.growTime - (new Date().getTime() - this.plantTime);

        if (!this.isGrown) {
            if (time <= 0) {
                this.additionalData = "Grown!";
                this.isGrown = true;
            } else {
                const textureId =
                    this.animations.length -
                    Math.floor(
                        time /
                            (this.data.plant.growTime / this.animations.length)
                    );

                this.texture = this.animations[textureId - 1];
                this.additionalData = `Time to collect: ${formatTime(time)}`;
            }
        } else {
            this.needUpdate = false;
            const filter = new PIXI.filters.ColorMatrixFilter();
            filter.saturate(0.5, true);
            this.filters = [filter];
            this.addPress(this.harvest);
        }

        if (this.is_hovered) {
            this.hoverEvent();
        }
        // console.log(this);
    };

    harvest = () => {
        const sprite = new Drop(this.data, this.mapData);

        sprite.sprite.zIndex = 3;
        sprite.sprite.anchor = this.anchor;
        sprite.sprite.x = this.parent.x;

        const targetY = this.parent.y;

        anime
            .timeline()
            .add({
                targets: sprite.sprite.scale,
                x: [0.8, 1],
                y: [0.8, 1],
                easing: "linear",
                duration: 100,
                complete: () => {
                    sprite.sprite.scale.set(1);
                },
            })
            .add({
                targets: sprite.sprite.position,
                y: [targetY - 6, targetY],
                easing: "linear",
                duration: 100,
                complete: () => {
                    sprite.sprite.y = targetY;
                },
            });

        this.cleanUp();
        this.cell.Dirt!.visible = true;

        this.mapData.addChild(sprite.sprite);
    };

    cleanUp = () => {
        this.mapData.plants.forEach((ob, i) => {
            if (ob.time === this.plantTime) {
                this.mapData.plants.splice(i, 1);
                console.log("removed");
            }
        });
        this.cell.removeChild(this);
        this.cell.Plant = undefined;

        this.destroy();
    };

    additionalHover = () => {
        document.dispatchEvent(
            new CustomEvent<WAILAData>(EVENTS.WAILA.Set, {
                detail: {
                    title: this.data.name,
                    description: this.data.description,
                    additionalData: this.additionalData,
                    rarity: this.data.rarity,
                },
            })
        );
    };

    additionalUnhover = () => {
        document.dispatchEvent(new Event(EVENTS.WAILA.Clean));
    };
}
