import "pixi-spine";
import packageInfo from "../package.json";
import { App } from "./App";
import "./TMAdditions/MatrixUtils";

declare const __ENVIRONMENT__: string;

function init() {
    document.getElementById("root")!.onmousedown = () => {
        return false;
    };

    const project_name = "Myola`s Garden";
    const full_project_name = `${project_name} v${packageInfo.version} ${__ENVIRONMENT__}`;

    console.log(full_project_name);

    document.title = full_project_name;

    new App();
}

if (document.readyState !== "loading") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
