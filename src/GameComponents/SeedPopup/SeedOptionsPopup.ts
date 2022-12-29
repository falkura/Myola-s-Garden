import { Plants } from "../../GameConfigs/Plants";
import { Button } from "../../GUI/Components/Button";
import TiledMap from "../../TMCore/TiledMap";
import { calculateCoordinate } from "../../Util";
import { Seed } from "./Seed";

export class SeedOptionsPopup extends PIXI.Container {
    map: TiledMap;
    isShown = false;
    seedsArray: Seed[] = [];
    seedPages: PIXI.Container[] = [];
    currentPage = 0;

    buttonPrev?: Button;
    buttonNext?: Button;

    private bg!: PIXI.Graphics;
    private shadow!: PIXI.Graphics;

    constructor(map: TiledMap) {
        super();
        this.map = map;

        this.createPopup();
        this.visible = false;
        this.scale.set(0);
    }

    createPopup = () => {
        this.createBG();
        this.createSeedOptions();
        this.createPageButtons();
    };

    createSeedOptions = () => {
        const seedsOnOnePage = 8;

        for (let p = 0; p < Plants.length; p += seedsOnOnePage) {
            const plants = Plants.slice(p, p + seedsOnOnePage);

            const coords = calculateCoordinate(plants.length, 61, 0, 0);
            console.log(coords);

            const page = new PIXI.Container();

            for (let i = 0; i < coords.length; i++) {
                const item = new Seed(Plants[p + i], this.map);

                item.setSize((50 / 3) * 2, (50 / 3) * 2);
                item.sprite.anchor.set(0.5, 0.5);
                item.addListener("mousedown", () => {
                    item.sprite.is_hovered = false;
                    console.log(item);
                });

                item.count = 5;
                item.position.set(coords[i].x, coords[i].y);

                this.seedsArray.push(item);

                page.addChild(item);
            }

            page.visible = false;

            this.seedPages.push(page);
        }

        this.addChild(...this.seedPages);

        if (this.seedPages[0]) this.seedPages[0].visible = true;
    };

    createPageButtons = () => {
        if (this.seedPages.length < 2) return;

        this.buttonPrev = new Button("arrow_left_on", "arrow_left_off").setScale(1.5);
        this.buttonPrev.callback = () => {
            this.changePage(this.currentPage - 1);
        };
        this.buttonPrev.position.set(-this.bg.width / 2 - this.buttonPrev.width / 2, 0);
        this.addChild(this.buttonPrev);

        this.buttonNext = new Button("arrow_right_on", "arrow_right_off").setScale(1.5);
        this.buttonNext.callback = () => {
            this.changePage(this.currentPage + 1);
        };
        this.buttonNext.position.set(this.bg.width / 2 + this.buttonNext.width / 2, 0);

        this.addChild(this.buttonNext);
    };

    changePage = (page: number) => {
        if (page === this.currentPage) return;

        page = page < 0 ? 0 : page > this.seedPages.length - 1 ? this.seedPages.length - 1 : page;

        this.seedPages[this.currentPage].visible = false;
        this.seedPages[page].visible = true;

        this.currentPage = page;
    };

    createBG = () => {
        const circleRadius = 40;
        const shadowPadding = 1;

        this.bg = new PIXI.Graphics()
            .beginFill(0xc89d7c)
            .drawCircle(0, 0, circleRadius * 2)
            .beginHole()
            .drawCircle(0, 0, circleRadius)
            .endFill();
        this.bg.interactive = true;

        this.shadow = new PIXI.Graphics()
            .beginFill(0x444444, 0.65)
            .drawCircle(0, 0, circleRadius * 2 + shadowPadding)
            .beginHole()
            .drawCircle(0, 0, circleRadius - shadowPadding)
            .endFill();

        this.shadow.filters = [new PIXI.filters.BlurFilter(5)];
        this.addChild(this.shadow);
        this.addChild(this.bg);
    };

    show = () => {
        if (this.isShown) return;

        this.visible = true;

        return gsap.to(this.scale, { duration: 100 / 1000, ease: "none", y: 1, x: 1 }).then(() => {
            this.isShown = true;
        });
    };

    hide = () => {
        if (!this.isShown) return;

        this.visible = true;

        return gsap.to(this.scale, { duration: 100 / 1000, ease: "none", y: 0, x: 0 }).then(() => {
            this.isShown = false;
            this.visible = false;
        });
    };

    clearPopup = () => {};

    cleanUp = () => {
        this.clearPopup();
        this.destroy();
    };
}
