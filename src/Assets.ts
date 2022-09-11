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
            key: "city",
            path: "city.jpg",
        },
        {
            key: "plate",
            path: "plate.png",
        },
        {
            key: "empty_long_on",
            path: "empty_long_on.png",
        },
        {
            key: "empty_long_off",
            path: "empty_long_off.png",
        },
        {
            key: "check_icon",
            path: "check_icon.png",
        },
    ],
    preload: [
        {
            key: "MouseCatpawNormal",
            path: "cursor/MouseCatpawNormal.png",
        },
        {
            key: "MouseCatpawPointer",
            path: "cursor/MouseCatpawPointer.png",
        },
        {
            key: "MouseCatpawHold",
            path: "cursor/MouseCatpawHold.png",
        },
    ],
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
