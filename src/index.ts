import "pixi-spine";
// import { TiledMap } from "./TMCore/TiledMap";
import packageInfo from "../package.json";
import { App } from "./App";

declare const __ENVIRONMENT__: string;

function init() {
    const game_name = "Myola`s Garden";
    const full_game_name = `${game_name} v${packageInfo.version} ${__ENVIRONMENT__}`;

    document.title = full_game_name;

    new App();
}

if (document.readyState !== "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
