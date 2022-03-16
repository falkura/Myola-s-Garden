import TiledMap from "./TiledMap";
import { iPlantData } from "./TMModel";
import { Item } from "../UI/Item";

export class Drop extends Item {
    mapData: TiledMap;
    data: iPlantData;
    additionalData = "";

    constructor(data: iPlantData, mapData: TiledMap) {
        super(data, mapData, "drop", "drop", true);

        this.data = data;
        this.additionalData = `Collectable`;
        this.mapData = mapData;
        this.mapData.drop.push(this);

        this.sprite.addPress(this.collect);
    }

    collect = () => {
        document.dispatchEvent(
            new CustomEvent<Drop>("collect_item", {
                detail: this,
            })
        );

        this.sprite.is_hovered = false;
        this.sprite.unhoverEvent();
        console.log("some drop");
    };

    remove = () => {
        const index = this.mapData.drop.indexOf(this);
        console.log(index);
        this.mapData.drop.splice(index, 1);
        this.sprite.destroy();
    };
}
