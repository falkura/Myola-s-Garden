import CharakterController from "./CharakterController";
import { Common } from "./Config/Common";
import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { ObserverText } from "./Observer";
import { SeedOption } from "./GameObjects/SeedOption";
import { TextStyles } from "./Config/TextStyles";
import { Character } from "./GameObjects/Character";
import { Chest } from "./GameObjects/Chest";
import { Drop } from "./GameObjects/Drop";
import Tile from "./TMCore/Tile";
import TiledMap from "./TMCore/TiledMap";
import { InventoryController } from "./UI/InventoryController";
import { Shop } from "./GameObjects/Shop";

export class MapController {
    map?: TiledMap;
    container: PIXI.Container;
    app: PIXI.Application;
    charakterController?: CharakterController;
    inventory?: InventoryController;
    shop!: Shop;
    se!: SeedOption;
    balanceText!: ObserverText;
    chb!: Character;
    chest!: Chest;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();

        this.addEventListeners();
    }

    test = () => {
        // this.list = new List(this.map!, 10, 6);
        // this.container.addChild(this.list);
    };

    addEventListeners = () => {
        document.addEventListener("wheel", this.onWheel);
        document.addEventListener("map_created", this.resize, { once: true });
        document.addEventListener(EVENTS.Seed.On, this.onSeed);
        document.addEventListener(EVENTS.Seed.Off, this.offSeed);
        // document.addEventListener(EVENTS.Debug.SetItem, this.setItem);
        document.addEventListener(EVENTS.Action.Tile.Choose, this.tileChoose);
        document.addEventListener("collect_item", this.collect);
    };

    tileChoose = async (e: Event) => {
        const tile: Tile = (e as CustomEvent<Tile>).detail;
        const char = this.map!.charakter; // @TODO hardcoded

        await char.setPosition(tile.x, tile.y);
        this.offSeed();
        this.onSeed();

        if (!tile.Dirt) {
            const texture = this.map?.getTileset("Dirt")?.textures[35];
            // this.map?.getTileset(Config.dirt.tileset)?.textures[
            //     Config.dirt.base
            // ];
            tile.setDirt(texture!);
        } else if (!tile.Plant) {
            this.se.position.set(tile.x, tile.y);
            const plant = await this.se.drawOptions();

            if (isNaN(plant)) {
                console.log("rejected");
            } else {
                tile.setPlant(plant);
            }
        } else {
            console.log("dirt and plant exist");
        }
    };

    collect = async (e: Event) => {
        const drop = (e as CustomEvent<Drop>).detail;

        const char = this.map!.charakter; // @TODO hardcoded

        await char.setPosition(drop.sprite.x, drop.sprite.y);

        const result = this.inventory!.insertItem(drop.data);
        if (result) drop.remove();
    };

    removeItem = () => {
        // this.itemCell?.removeItem();
    };

    onSeed = () => {
        const al = this.map!.charakter.activeLayer;

        const walkableLayers = this.map!.getWalkableLayers();

        for (let i = 0; i < walkableLayers.length; i++) {
            if (walkableLayers[i].source.id === al) {
                for (const tile of walkableLayers[i].tiles) {
                    if (tile) {
                        const char = this.map!.charakter; // @TODO hardcoded

                        const dist = 2;

                        if (
                            Math.abs(tile._x - char!._x) > dist ||
                            Math.abs(tile._y - char!._y) > dist ||
                            !tile.getProperty("canPlant")
                        ) {
                        } else {
                            tile.debugGraphics.visible = true;
                        }
                    }
                }
            }
        }
    };

    offSeed = () => {
        const walkableLayers = this.map!.getWalkableLayers();

        for (const layer of walkableLayers) {
            for (const tile of layer.tiles) {
                if (tile) tile.debugGraphics.visible = false;
            }
        }
    };

    createMap = (mapName: string) => {
        this.map = new TiledMap(mapName, this.app);
        this.charakterController = new CharakterController(this.map);
        this.container.addChild(this.map);
        this.inventory = new InventoryController(this.map);
        this.inventory.position.set(Common.inventoryCellBorder / 2, 200);
        this.container.addChild(this.inventory);

        this.shop = new Shop(this.map, "Meeky Milk`s shop");
        // this.shop.isActive = true;
        this.shop.position.set(500, 200);
        // this.container.addChild(this.shop);

        this.se = new SeedOption(this.map!);
        this.se.zIndex = 5;
        this.map.addChild(this.se);

        this.balanceText = new ObserverText(
            "0",
            TextStyles.WAILATitle,
            LogicState
        );

        this.balanceText.on_state_update = () => {
            this.balanceText.text = LogicState.balance.toString();
        };
        this.balanceText.position.set(50, 10);
        this.container.addChild(this.balanceText);

        setTimeout(() => {
            this.chb = new Character(this.map!);
            this.chb.position.set(130, 250);
            this.chb.zIndex = 10000;
            this.map!.addChild(this.chb);

            this.chest = new Chest(this.map!);
            this.chest.position.set(120, 170);
            this.chest.zIndex = 10000;
            this.map!.addChild(this.chest);
        }, 300);
    };

    removeMap = () => {};

    onWheel = (e: WheelEvent) => {
        const step = 0.2;

        if (e.deltaY > 0) {
            if (Common.map_scale >= Common.min_scale) {
                if (this.map!.scale.x - step <= Common.min_scale) {
                    this.map!.scale.x = this.map!.scale.y = Common.min_scale;
                } else {
                    this.map!.scale.x = this.map!.scale.y -= step;
                }
                Common.map_scale = this.map!.scale.x;
            }
        } else {
            if (Common.map_scale <= Common.max_scale) {
                if (this.map!.scale.x + step >= Common.max_scale) {
                    this.map!.scale.x = this.map!.scale.y = Common.max_scale;
                } else {
                    this.map!.scale.x = this.map!.scale.y += step;
                }
                Common.map_scale = this.map!.scale.x;
            }
        }

        this.map!.charakter.cameraMove();
    };

    resize = () => {
        if (this.map) {
            if (Common.game_width / Common.game_height >= 1) {
                Common.map_scale = Common.game_width / Common.map_static_width;
            } else {
                Common.map_scale =
                    Common.game_height / Common.map_static_height;
            }

            Common.min_scale = Common.map_scale;
            this.map.scale.set(Common.map_scale);

            this.map.x = (this.map.source.tilewidth / 2) * Common.map_scale;
            this.map.y = (this.map.source.tileheight / 2) * Common.map_scale;

            if (this.map!.charakter) {
                this.map!.charakter.cameraMove();
            }
        }

        if (this.inventory) {
            this.inventory.x = Common.game_width / 2 - this.inventory.width / 2;
            this.inventory.y = Common.game_height - this.inventory.height;
        }
    };
}
