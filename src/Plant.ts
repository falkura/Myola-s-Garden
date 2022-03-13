import anime from "animejs";
import { Config } from "./Config";
import { Clickable } from "./TMCore/Clickable";
import { Drop } from "./TMCore/Drop";
import Tile from "./TMCore/Tile";
import TiledMap from "./TMCore/TiledMap";
import { iPlantData } from "./TMCore/TMModel";

export class Plant extends Clickable {
    isGrown = false;
    needUpdate = true;
    plantTime: number;
    animations: PIXI.Texture[] = [];
    cell: Tile;

    data: iPlantData;

    constructor(id: number, mapData: TiledMap, tile: Tile) {
        super(
            Config.plants_[id],
            Config.plants_[id].plant.id,
            mapData.getTileset(Config.plants_[id].plant.tileset)!,
            mapData
        );
        this.data = Config.plants_[id];

        this.cell = tile;
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
    }

    update = () => {
        if (!this.needUpdate) return;
        const time =
            this.data.plant.growTime - (new Date().getTime() - this.plantTime);

        if (!this.isGrown) {
            if (time <= 0) {
                this.description.time = "grown";
                this.isGrown = true;
            } else {
                const textureId =
                    this.animations.length -
                    Math.floor(
                        time /
                            (this.data.plant.growTime / this.animations.length)
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
        const sprite = new Drop(this.data, this.mapData);

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
}
