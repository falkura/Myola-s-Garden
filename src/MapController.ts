// import { Tile } from "./TMCore/Tile";
import CharakterController from "./CharakterController";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { LogicState } from "./logic_state";
import { ObserverText } from "./Observer";
import { SeedOption } from "./SeedOption";
import { TextStyles } from "./TextStyles";
import Character from "./TMCore/Character";
import { Drop } from "./TMCore/Drop";
import Tile from "./TMCore/Tile";
import TiledMap from "./TMCore/TiledMap";
import { InventoryController } from "./UI/InventoryController";
import { Shop } from "./UI/Shop";

export class MapController {
    map?: TiledMap;
    container: PIXI.Container;
    app: PIXI.Application;
    charakterController?: CharakterController;
    inventory?: InventoryController;
    shop!: Shop;
    se!: SeedOption;
    balanceText!: ObserverText;

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
        document.addEventListener(EVENTS.Debug.RemoveItem, this.removeItem);
        document.addEventListener(EVENTS.Action.Tile.Choose, this.tileChoose);
        document.addEventListener("collect_item", this.collect);
    };

    tileChoose = async (e: Event) => {
        const tile: Tile = (e as CustomEvent<Tile>).detail;
        const char: Character = this.charakterController!.getActiveCharakter()!; // @TODO hardcoded

        await char.setPosition(tile.x, tile.y);
        this.offSeed();
        this.onSeed();

        if (!tile.Dirt) {
            const texture = this.map?.getTileset("Dirt")?.textures[35];
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

        const char: Character = this.charakterController!.getActiveCharakter()!; // @TODO hardcoded
        await char.setPosition(drop.sprite.x, drop.sprite.y);

        const result = this.inventory!.insertItem(drop.data);
        if (result) drop.remove();
    };

    removeItem = () => {
        // this.itemCell?.removeItem();
    };

    onSeed = () => {
        const al = this.charakterController?.getActiveCharakter()?.activeLayer;

        const walkableLayers = this.map!.getWalkableLayers();

        for (let i = 0; i < walkableLayers.length; i++) {
            if (walkableLayers[i].source.id === al) {
                for (const tile of walkableLayers[i].tiles) {
                    if (tile) {
                        const char: Character =
                            this.charakterController!.getActiveCharakter()!;
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
        this.inventory.position.set(Config.inventoryCellBorder / 2, 200);
        this.container.addChild(this.inventory);

        this.shop = new Shop(this.map, "Meeky Milk`s shop");
        this.shop.isActive = true;
        this.shop.position.set(500, 200);
        this.container.addChild(this.shop);

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
    };

    removeMap = () => {};

    onWheel = (e: WheelEvent) => {
        const step = 0.2;

        if (e.deltaY > 0) {
            if (Config.map_scale >= Config.min_scale) {
                if (this.map!.scale.x - step <= Config.min_scale) {
                    this.map!.scale.x = this.map!.scale.y = Config.min_scale;
                } else {
                    this.map!.scale.x = this.map!.scale.y -= step;
                }
                Config.map_scale = this.map!.scale.x;
            }
        } else {
            if (Config.map_scale <= Config.max_scale) {
                if (this.map!.scale.x + step >= Config.max_scale) {
                    this.map!.scale.x = this.map!.scale.y = Config.max_scale;
                } else {
                    this.map!.scale.x = this.map!.scale.y += step;
                }
                Config.map_scale = this.map!.scale.x;
            }
        }

        this.charakterController?.getActiveCharakter()?.cameraMove();
    };

    resize = () => {
        if (this.map) {
            if (Config.game_width / Config.game_height >= 1) {
                Config.map_scale = Config.game_width / Config.map_static_width;
            } else {
                Config.map_scale =
                    Config.game_height / Config.map_static_height;
            }

            Config.min_scale = Config.map_scale;
            this.map.scale.set(Config.map_scale);

            this.map.x = (this.map.source.tilewidth / 2) * Config.map_scale;
            this.map.y = (this.map.source.tileheight / 2) * Config.map_scale;

            this.charakterController?.getActiveCharakter()?.cameraMove();
        }

        if (this.inventory) {
            this.inventory.x = Config.game_width / 2 - this.inventory.width / 2;
            this.inventory.y = Config.game_height - this.inventory.height;
        }
    };
}
