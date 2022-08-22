import TiledMap from "../../TMCore/TiledMap";
import { CharacterBase } from "./CharacterBase";

export class Trader extends CharacterBase {
    constructor(mapData: TiledMap) {
        super(mapData, "trader");
        this.onClick = this.onCharClick;
        this.setNewColor(4);
    }

    onCharClick = () => {
        document.dispatchEvent(new Event("shop_"));
        console.log("kek");
    };
}
