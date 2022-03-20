import { LogicState } from "../logic_state";
import { ObserverText } from "../Observer";
import { TextStyles } from "../TextStyles";
import TiledMap from "../TMCore/TiledMap";
import { ButtonTemp } from "./Components/ButtonTemp";
import { List } from "./List";

export class Shop extends PIXI.Container {
    buyList!: List;
    sellList!: List;
    mapData: TiledMap;
    sellPrice!: ObserverText;
    balance!: ObserverText;
    columns = 3;
    rows = 5;

    padding = 10;
    header!: PIXI.Container;
    footer!: PIXI.Container;

    shopName: string;

    shopText!: PIXI.Text;
    buyText!: PIXI.Text;
    sellText!: PIXI.Text;

    sellButton!: ButtonTemp;

    constructor(mapData: TiledMap, shopName: string) {
        super();

        this.mapData = mapData;
        this.shopName = shopName;

        this.createHeader();
        this.createLists();
        this.createFooter();
        this.createBg();
    }

    createHeader = () => {
        this.header = new PIXI.Container();
        this.header.zIndex = 1;
        this.addChild(this.header);

        this.shopText = new PIXI.Text(this.shopName, TextStyles.WAILATitle);
        this.shopText.anchor.set(0.5, 0.5);

        this.buyText = new PIXI.Text("buy", TextStyles.ShopInfo);
        this.buyText.anchor.set(0.5, 0.5);

        this.sellText = new PIXI.Text("sell", TextStyles.ShopInfo);
        this.sellText.anchor.set(0.5, 0.5);

        this.header.addChild(this.shopText, this.buyText, this.sellText);
    };

    createLists = () => {
        this.buyList = new List(
            this.mapData,
            this.columns,
            this.rows,
            "shopBuy"
        );
        this.addChild(this.buyList);

        this.sellList = new List(
            this.mapData,
            this.columns,
            this.rows,
            "shopSell"
        );
        this.addChild(this.sellList);
        // this.buyList.y = this.sellList.y = this.header.height + this.padding;
        // this.sellList.position.x = this.buyList.width + this.padding * 2;
    };

    createFooter = () => {
        this.footer = new PIXI.Container();
        this.addChild(this.footer);

        this.sellPrice = new ObserverText(
            "0",
            TextStyles.itemCount,
            LogicState
        );
        this.sellPrice.on_state_update = () => {
            this.sellPrice.text = this.sellList.price.toString();
        };
        this.sellPrice.anchor.set(1, 0.5);
        this.footer.addChild(this.sellPrice);

        this.balance = new ObserverText(
            LogicState.balance.toString(),
            TextStyles.itemCount,
            LogicState
        );
        this.balance.on_state_update = () => {
            this.balance.text = LogicState.balance.toString();
        };
        this.balance.anchor.set(0, 0.5);
        this.footer.zIndex = 1;
        this.footer.addChild(this.balance);

        const graphics = new PIXI.Graphics()
            // .lineStyle(3, 0x000000, 1)
            // .beginFill(0xb77e53)
            .beginFill(0xfa7e53)
            .drawRoundedRect(0, 0, 60, 30, 5)
            .endFill();

        this.sellButton = new ButtonTemp(graphics, "sell");
        document.addEventListener("sellbutton", this.onSell);
        this.sellButton.event = new Event("sellbutton");
        this.sellButton.position.set(200, 0);
        this.footer.addChild(this.sellButton);
    };

    onSell = () => {
        LogicState.balance += +this.sellPrice.text;
        this.sellList.cleanup();
        LogicState.notify_all();
    };

    createBg = () => {
        // SET POSITIONS
        this.buyList.position.set(
            this.padding,
            this.padding * 2 + this.header.height * 2
        );

        this.sellList.position.set(
            this.buyList.width + this.padding * 3,
            this.padding * 2 + this.header.height * 2
        );

        this.shopText.position.set(
            (this.buyList.width + this.sellList.width + this.padding * 4) / 2,
            this.padding + this.shopText.height / 2
        );

        const divider = new PIXI.Graphics()
            .lineStyle(2, 0xcea78a)
            .moveTo(this.padding, this.shopText.height + this.padding * 1.5)
            .lineTo(
                this.width - this.padding * 2,
                this.shopText.height + this.padding * 1.5
            );

        this.header.addChild(divider);

        this.buyText.position.set(
            this.buyList.x + this.buyList.width / 2,
            this.shopText.height +
                this.padding / 2 +
                (this.buyText.height + this.padding)
        );

        this.sellText.position.set(
            this.sellList.x + this.sellList.width / 2,
            this.shopText.height +
                (this.sellText.height + this.padding) +
                this.padding / 2
        );

        this.footer.y =
            this.header.height + this.buyList.height + this.padding * 2;

        this.sellPrice.position.set(
            this.sellList.x + this.sellList.width - this.padding,
            this.padding * 1.5
        );
        this.balance.position.set(
            this.buyList.x + this.padding,
            this.padding * 1.5
        );

        const bg = new PIXI.Graphics()
            .beginFill(0x91623d)
            .drawRoundedRect(
                0,
                0,
                this.width + this.padding * 2,
                this.height + this.padding * 2,
                this.buyList.radius
            )
            .endFill();

        bg.zIndex = 0;
        this.addChild(bg);
    };

    public set isActive(value: boolean) {
        this.sellList.isActive = value;
    }

    public get isActive(): boolean {
        return this.sellList.isActive;
    }
}
