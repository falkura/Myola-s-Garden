import { IResourceDictionary } from "pixi.js";
import { ANIMATIONS, ATLASES, FONTS, IMAGES, MAPS } from "./Assets";
import { Global_Vars } from "./GlobalVariables";
import { SessionConfig } from "./Config";
import { LoaderScreen } from "./GUI/Screens/LoaderScreen";
import { core } from "./PIXI/core";

type ResourceType = "preload" | "main";
export type LoadProcesses = ResourceType | "map";

export interface Resources {
    defaultPath: string;
    preload?: Resource[];
    main: Resource[];
    preloadMobile?: Resource[];
    mainMobile?: Resource[];
}

export interface Resource {
    key: string;
    path: string;
    spineScale?: number;
}

class Loader {
    private _screen?: LoaderScreen;
    loader = PIXI.Loader.shared;

    public get resources(): IResourceDictionary {
        return this.loader.resources;
    }

    public set screen(ls: LoaderScreen | undefined) {
        if (this._screen) return;

        this._screen = ls;

        this.loader.onProgress.add(() => {
            this._screen?.update(this.loader.progress);
        });
    }

    public get screen(): LoaderScreen | undefined {
        return this._screen;
    }

    getResource = (key: string): PIXI.LoaderResource => {
        const resource = this.resources[key];

        if (!resource) throw new Error(`There is no resource with name - {${key}}`);

        return resource;
    };

    getTexture = (key: string): PIXI.Texture => {
        const data = this.getResource(key);
        let texture: PIXI.Texture;

        if (data instanceof PIXI.Texture) {
            texture = data;
        } else {
            texture = data.texture;
        }

        if (!texture) throw new Error(`There is no texture with name - {${key}}`);

        return texture;
    };

    getSprite = (key: string): core.Sprite => {
        const texture = this.getTexture(key);
        return new core.Sprite(texture);
    };

    getSpineData = (key: string): PIXI.spine.core.SkeletonData => {
        const resource = this.getResource(key);

        if (resource instanceof PIXI.Texture) {
            throw new Error(`Resource with name {${key}} is not a spine.`);
        }

        const spineData = resource.spineData;

        if (!spineData) {
            if (resource.data) {
                throw new Error(`Export spine - {${key}} for version 3.8\n Version 4 not supported.`);
            } else {
                throw new Error(`There is no spineData in resource - {${key}}`);
            }
        }

        return spineData;
    };

    getSpine = (key: string): PIXI.spine.Spine => {
        const spineData = this.getSpineData(key);
        return new PIXI.spine.Spine(spineData);
    };

    addResources = (type: ResourceType) => {
        const toLoad = [ANIMATIONS, IMAGES, ATLASES];

        toLoad.forEach(assetList => {
            assetList[type]?.forEach(asset => {
                this.loader.add(
                    asset.key,
                    `${SessionConfig.ASSETS_ADDRESS}${assetList.defaultPath}${asset.path}`,
                    assetList === ANIMATIONS
                        ? {
                              metadata: {
                                  spineSkeletonScale: asset.spineScale || 1,
                              },
                          }
                        : {},
                );
            });

            if (Global_Vars.is_mobile) {
                assetList[`${type}Mobile`]?.forEach(asset => {
                    this.loader.add(asset.key, `${SessionConfig.ASSETS_ADDRESS}${asset.path}`);
                });
            }
        });
    };

    addMaps = () => {
        MAPS.forEach(mapData => {
            this.loader.add(mapData.key, `${SessionConfig.ASSETS_ADDRESS}${mapData.path}`);
        });
    };

    /** Now you can use it like promise with await.
     *
     * Note, that onLoad will be executed first, before promise resolve.
     */
    loadResources = (onLoad: () => void, processName: LoadProcesses) => {
        console.log(Global_Vars.app_state);
        this.screen?.show(processName);

        return new Promise<void>(resolve => {
            this.loader.load(async () => {
                await this.screen?.hide();

                if (processName !== "map" && ATLASES[processName]) {
                    for (const atlas of ATLASES[processName]!) {
                        Object.assign(ResourceController.resources, ResourceController.resources[atlas.key].textures);
                    }
                }

                onLoad();

                resolve();
            });
        });
    };

    loadFonts = () => {
        const newStyle = document.createElement("style");

        FONTS.forEach(font => {
            const extensionRaw = font.path.match(/\.[0-9a-z]+$/i);

            if (!extensionRaw) {
                console.error(`Font ${font.key} has no type`);
            }

            const extension = extensionRaw![0].slice(1);

            let fontCssFormat = "";

            switch (extension) {
                case "ttf":
                    fontCssFormat = "truetype";
                    break;
                case "otf":
                    fontCssFormat = "opentype";
                    break;

                default:
                    console.error(`Incorrect type of font ${font.key}`);
                    break;
            }

            newStyle.appendChild(
                document.createTextNode(
                    `@font-face {
                        font-family: "${font.key}";
                        src: url("./assets/fonts/${font.path}") format("${fontCssFormat}");
                    }`,
                ),
            );
        });

        document.head.appendChild(newStyle);

        FONTS.forEach(font => {
            const div = document.createElement("div");
            div.innerHTML = ".";
            div.style.fontFamily = font.key;
            div.style.opacity = "0";
            // div.style.visibility = "hidden";
            document.getElementById("root")!.appendChild(div);
        });
    };
}

export const ResourceController = new Loader();
