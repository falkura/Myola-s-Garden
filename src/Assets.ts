import { Resource, Resources } from "./ResourceLoader";

/** Should be in assets/spine/ */
export const ANIMATIONS: Resources = {
    defaultPath: "spine/",

    main: [],
};

/** Should be in assets/images/ */
export const IMAGES: Resources = {
    defaultPath: "images/",

    main: [
        {
            key: "project_bg",
            path: "project_bg.jpg",
        },
    ],
    preload: [],
};

/** Should be in assets/atlases/ */
export const ATLASES: Resources = {
    defaultPath: "atlases/",

    main: [
        {
            key: "gui_buttons",
            path: "GUI_Buttons.json",
        },
    ],
};

/** Should be in assets/fonts/ */
export const FONTS: Resource[] = [{ key: "ARCADECLASSIC", path: "ARCADECLASSIC.ttf" }];

export const MAPS: Resource[] = [
    {
        key: "map3",
        path: "map3.json",
    },
    {
        key: "testtiledmap",
        path: "testtiledmap.json",
    },
];
