import { Resource, Resources } from "./ResourceLoader";

/** Should be in assets/spine/ */
export const ANIMATIONS: Resources = {
    main: [],
};

/** Should be in assets/images/ */
export const IMAGES: Resources = {
    main: [
        {
            key: "project_bg",
            path: "images/project_bg.jpg",
        },
    ],
    preload: [],
};

/** Should be in assets/atlases/ */
export const ATLASES: Resources = {
    main: [],
};

/** Should be in assets/fonts/ */
export const FONTS: Resource[] = [{ key: "ARCADECLASSIC", path: "fonts/ARCADECLASSIC.ttf" }];

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
