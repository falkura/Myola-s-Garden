import TiledMap from "../TMCore/TiledMap";
import { iPlantData } from "../Model";
import { Item } from "./Item";

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
    };

    remove = () => {
        const index = this.mapData.drop.indexOf(this);
        this.mapData.drop.splice(index, 1);
        this.sprite.destroy();
    };
}
