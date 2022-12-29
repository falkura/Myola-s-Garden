import { EVENTS } from "./Events";
import TiledMap from "./TMCore/TiledMap";
import { delayedCallback, waitForEvent } from "./Util";

export class RoofController {
    map: TiledMap;
    hoveredRoofs: gsap.core.Tween[] = [];

    constructor(map: TiledMap) {
        this.map = map;

        this.addEventListeners();
    }

    addEventListeners = () => {
        document.addEventListener(EVENTS.Actions.Roof.Hover, this.onHover);
        document.addEventListener(EVENTS.Actions.Roof.Unhover, this.onUnhover);
        // document.addEventListener(EVENTS.Map.Hover, this.onUnhover);
    };

    removeEventListeners = () => {
        document.removeEventListener(EVENTS.Actions.Roof.Hover, this.onHover);
        document.removeEventListener(EVENTS.Actions.Roof.Unhover, this.onUnhover);
    };

    onHover = (e: Event) => {
        const roofNumber = (e as CustomEvent<number>).detail;

        if (!this.hoveredRoofs[roofNumber]) this.hoveredRoofs[roofNumber] = this.hideRoof(roofNumber);
    };

    onUnhover = (e: Event) => {
        const roofNumber = (e as CustomEvent<number>).detail;

        const show = delayedCallback(() => {
            this.showRoof(roofNumber);
            this.hoveredRoofs[roofNumber] = undefined as unknown as gsap.core.Tween;
        }, 100);

        waitForEvent(EVENTS.Actions.Roof.Hover).then(show.destroy);
    };

    hideRoof = (num: number) => {
        console.log("Hide roof number", num);

        const roofArr = this.map.objectLayers.roofs[num].map(_r => _r.sprite);

        return gsap.to(roofArr, { alpha: 0.1, ease: "none", duration: 500 / 1000 });
    };

    showRoof = (num: number) => {
        console.log("Show roof number", num);

        const roofArr = this.map.objectLayers.roofs[num].map(_r => _r.sprite);

        return gsap.to(roofArr, { alpha: 1, ease: "none", duration: 500 / 1000 });
    };

    cleanUp = () => {
        this.removeEventListeners();
    };
}
