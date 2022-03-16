import { Clickable } from "../Clickable";
import { iPlantData } from "../TMCore/TMModel";

export class InventoryItem extends Clickable {
    data: iPlantData;

    constructor(data: iPlantData, texture: PIXI.Texture) {
        super(texture);

        this.data = data;
    }
}
