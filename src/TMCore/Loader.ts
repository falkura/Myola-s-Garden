import { ASSETS } from "../Assets";
import { EVENTS } from "../Events";
import { SessionConfig } from "../Config/SessionConfig";
import { iMapData } from "../Model";

export default class Loader {
    mapData: iMapData;
    container: PIXI.Container;

    constructor(mapData: iMapData) {
        this.mapData = mapData;
        this.container = new PIXI.Container();
    }

    load = (): Promise<void> => {
        document.dispatchEvent(new Event(EVENTS.Load.Start));

        const loader = PIXI.Loader.shared;
        for (const tileset of this.mapData.tilesets) {
            loader.add(
                tileset.name,
                `${SessionConfig.ASSETS_ADDRESS}${tileset.image}`
            );
        }

        loader.onProgress.add(() => {
            console.log(loader.progress);
        });

        const promise = new Promise<void>((resolve) => {
            loader.load(() => {
                for (const tileset of this.mapData.tilesets) {
                    ASSETS[tileset.name] =
                        PIXI.Loader.shared.resources[tileset.name];
                }
                resolve();
                document.dispatchEvent(new Event(EVENTS.Load.Complete));
            });
        });

        return promise;
    };
}
