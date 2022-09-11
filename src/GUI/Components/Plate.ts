import { ResourceController } from "../../ResourceLoader";
import { BaseComponent } from "./BaseComponent";

export class Plate extends BaseComponent {
    constructor() {
        super(ResourceController.getTexture("plate"));
        this.anchor.set(0.5);
    }
}
