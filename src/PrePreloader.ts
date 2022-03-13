import { SessionConfig, SessionConfigType, Languages } from "./SessionConfig";
import FontFaceObserver from "fontfaceobserver";
import { FONTS } from "./Assets";

export class PrePreloader {
    readonly container: PIXI.Container;
    private readonly app: PIXI.Application;
    on_preloader_loaded_event: Event;

    constructor(app: PIXI.Application, on_preloader_loaded_event: Event) {
        this.app = app;
        this.on_preloader_loaded_event = on_preloader_loaded_event;
        this.container = new PIXI.Container();
        this.get_session_params().then(this.set_session_params);
    }

    get_session_params = (): Promise<SessionConfigType> => {
        const url =
            `${window.location.origin}${window.location.pathname}`.replace(
                "index.html",
                ""
            );
        const ASSETS_ADDRESS = `${url}assets/`;

        return Promise.resolve({
            ASSETS_ADDRESS: ASSETS_ADDRESS,
            LANGUAGE: Languages.en,
            LOCALE: "en-US",
        });
    };

    set_session_params = (params: SessionConfigType) => {
        SessionConfig.ASSETS_ADDRESS = params.ASSETS_ADDRESS;
        SessionConfig.LANGUAGE = params.LANGUAGE;
        SessionConfig.LOCALE = params.LOCALE;

        this.load_assets();
    };

    load_assets = () => {
        const result = PIXI.Loader.shared
            .add("load_bar", `${SessionConfig.ASSETS_ADDRESS}load_bar.png`)
            .add(
                "load_progress",
                `${SessionConfig.ASSETS_ADDRESS}load_progress.png`
            )
            .add("loading_bg", `${SessionConfig.ASSETS_ADDRESS}loading_bg.png`)
            .add("lamp", `${SessionConfig.ASSETS_ADDRESS}Lamp.png`)
            .add(
                "lamp-mobile",
                `${SessionConfig.ASSETS_ADDRESS}Lamp-mobile.png`
            );

        const assets_loaded_promise = new Promise<void>((resolve) => {
            result.load(() => {
                resolve();
            });
        });

        const newStyle = document.createElement("style");

        for (const font of FONTS) {
            newStyle.appendChild(
                document.createTextNode(
                    `@font-face {
    font-family: "${font}";
    src: url("./assets/fonts/${font}.ttf") format("truetype");
}`
                )
            );
        }

        document.head.appendChild(newStyle);

        const assets_promises = [assets_loaded_promise];

        for (const f of FONTS) {
            const font = new FontFaceObserver(f);
            const font_promise = font.load();
            assets_promises.push(font_promise);
        }
        Promise.all(assets_promises).then(() => {
            document.dispatchEvent(this.on_preloader_loaded_event);
        });
    };

    on_resize = () => {};
}
