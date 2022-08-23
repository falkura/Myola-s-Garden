import { IResourceDictionary } from "pixi.js";
import { ANIMATIONS, ATLASES, FONTS, IMAGES, MAPS } from "./Assets";
import { LogicState } from "./logic_state";
import { SessionConfig } from "./Config";

export type ResourceType = "preload" | "main";

export interface Resources {
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
	loader = PIXI.Loader.shared;

	public get resources(): IResourceDictionary {
		return this.loader.resources;
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

	getSprite = (key: string): PIXI.Sprite => {
		const texture = this.getTexture(key);
		return new PIXI.Sprite(texture);
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
					`${SessionConfig.ASSETS_ADDRESS}${asset.path}`,
					assetList === ANIMATIONS
						? {
								metadata: {
									spineSkeletonScale: asset.spineScale || 1,
								},
						  }
						: {},
				);
			});

			if (LogicState.is_mobile) {
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

	loadResources = (onLoad: () => void) => {
		this.loader.load(onLoad);
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
                        src: url("./assets/${font.path}") format("${fontCssFormat}");
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
			document.body.appendChild(div);
		});
	};
}

export const ResourceController = new Loader();
