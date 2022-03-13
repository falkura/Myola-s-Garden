import { Clickable } from "./Clickable";
import TiledMap from "./TiledMap";
import { iDrop } from "./TMModel";

export class Drop extends Clickable {
    mapData: TiledMap;
    data: iDrop;

    constructor(data: iDrop, mapData: TiledMap) {
        super(data, mapData.getTileset(data.tileset)!, mapData);

        this.data = data;
        this.mapData = mapData;
        this.mapData.drop.push(this);

        this.setOnClick(this.collect);
    }

    collect = () => {
        document.dispatchEvent(
            new CustomEvent<Drop>("collect_item", {
                detail: this,
            })
        );

        this.is_hovered = false;
        this.unhoverEvent();
        console.log("some drop");
    };

    remove = () => {
        const index = this.mapData.drop.indexOf(this);
        console.log(index);
        this.mapData.drop.splice(index, 1);
        this.destroy();
    };
}
