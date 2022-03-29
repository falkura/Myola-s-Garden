import CharakterController from "./CharakterController";
import { Common } from "./Config/Common";
import { LogicState } from "./logic_state";
import { ObserverText } from "./Observer";
import { SeedOption } from "./GameObjects/SeedOption";
import { TextStyles } from "./Config/TextStyles";
import { Character } from "./GameObjects/Character";
import { Chest } from "./GameObjects/Chest";
import { Drop } from "./GameObjects/Drop";
import TiledMap from "./TMCore/TiledMap";
import { InventoryController } from "./UI/InventoryController";
import { Shop } from "./GameObjects/Shop";
import { LocalStorage } from "./LocalStorage";
import { Trader } from "./GameObjects/Trader";

export class MapController {
    map!: TiledMap;
    container: PIXI.Container;
    app: PIXI.Application;
    charakterController?: CharakterController;
    inventory?: InventoryController;
    shop!: Shop;
    se!: SeedOption;
    balanceText!: ObserverText;
    chb!: Character;
    trader!: Trader;
    chest!: Chest;
    mapCreated = false;

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
        // document.addEventListener("map_created", this.resize, { once: true });

        document.addEventListener("shop_", () => {
            this.shop.isActive = !this.shop.isActive;
        });
        document.addEventListener("collect_item", this.collect);
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

    createMap = () => {
        // this.map = new TiledMap(mapName, this.app);
        this.charakterController = new CharakterController(this);
        this.container.addChild(this.map);
        this.inventory = new InventoryController(this.map);
        this.inventory.position.set(Common.inventoryCellBorder / 2, 200);
        this.container.addChild(this.inventory);

        this.shop = new Shop(this.map, "Meeky Milk`s shop");
        // this.shop.isActive = true;
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

        const data = LocalStorage.data;

        for (const id of Object.keys(data)) {
            switch (data[id].name) {
                case "character":
                    // this.chb = new Character(this.map!);
                    // this.chb.restore(id);
                    break;
                case "chest":
                    // this.chest = new Chest(this.map!);
                    // this.chest.restore(id);
                    break;
                default:
                    console.log(data[id]);
                    break;
            }
        }

        // if (!this.chb) {
        //     this.chb = new Character(this.map!);
        //     this.chb.position.set(130, 250);
        // }

        // this.chb.zIndex = 10000;
        // this.map!.addChild(this.chb);

        if (!this.chest) {
            this.chest = new Chest(this.map!);
            this.chest.position.set(120, 170);
        }

        this.chest.zIndex = 9000;
        this.map!.addChild(this.chest);

        this.trader = new Trader(this.map!);
        this.trader.position.set(90, 200);

        this.trader.zIndex = 10000;
        this.map!.addChild(this.trader);

        this.mapCreated = true;
        this.resize();
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
