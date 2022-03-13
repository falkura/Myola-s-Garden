import anime from "animejs";
import ObjectTile from "./ObjectTile";
import { Popup } from "./Popup";
import TiledMap from "./TiledMap";
import TileSet from "./TileSet";
import { iDataObject } from "./TMModel";

export default class Item extends ObjectTile {
    is_hovered = false;
    popup!: Popup;
    mask!: PIXI.Graphics;

    constructor(tileData: iDataObject, tileSet: TileSet, mapData: TiledMap) {
        super(tileData, tileSet);
        mapData.items.push(this);
        this.interactive = true;
        this.cursor = "pointer";
        this.addEventListeners();

        this.createPopup();
    }

    clickEvent = () => {
        console.log(this.source.name);
        this.scale.set(1);
        // this.alpha = 0.5;
    };

    unpressEvent = () => {
        this.scale.set(1);
        if (this.is_hovered) this.hoverEvent();
    };

    hoverEvent = () => {
        this.is_hovered = true;
        if (this.popup.alpha < 1) {
            this.showPopup();
        }
        this.scale.set(1.2);
    };

    unhoverEvent = () => {
        this.is_hovered = false;
        this.scale.set(1);
        this.hidePopup();
    };

    createPopup = () => {
        this.popup = new Popup(this.source.name);
        this.popup.position.set(13, -8);
        this.popup.zIndex = 2;
        this.popup.visible = false;
        this.popup.alpha = 0;

        this.addChild(this.popup);
    };

    showPopup = () => {
        this.popup.visible = true;
        this.popup.alpha = 0;
        anime({
            duration: 500,
            targets: this.popup,
            easing: "easeInBack",
            alpha: 1,
        });
    };

    hidePopup = () => {
        this.popup.visible = false;
        this.popup.alpha = 0;
    };

    addEventListeners = () => {
        this.on("pointerdown", this.clickEvent);
        this.on("pointerover", this.hoverEvent);
        this.on("pointerout", this.unhoverEvent);
        this.on("pointerup", this.unpressEvent);
        this.on("pointerupoutside", this.unpressEvent);
    };
}
