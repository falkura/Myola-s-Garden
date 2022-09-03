const DefaultConfig = {
    dirt: undefined,
    plant: undefined,
};

export type TileCompTypes = keyof typeof DefaultConfig;

type ITileComp = { sprite: PIXI.Sprite | PIXI.AnimatedSprite; type: TileCompTypes };

type IAdditions = {
    [key in TileCompTypes]?: ITileComp;
};

export class TileBase extends PIXI.Container {
    _x!: number;
    _y!: number;

    sprite!: PIXI.AnimatedSprite; // external constructor
    additions!: IAdditions;

    constructor() {
        super();
        this.setDefaultAdditions();
    }

    private setDefaultAdditions = () => {
        this.additions = JSON.parse(JSON.stringify(DefaultConfig));
    };

    addTileComp = (comp: ITileComp) => {
        if (this.additions[comp.type]) {
            console.error(`${comp.type.toUpperCase()} already exist in tile!`);
            return;
        }

        this.additions[comp.type] = comp;

        comp.sprite.anchor.set(0.5);
        this.sprite.addChild(comp.sprite);
    };

    removeTileComp = (comp: TileCompTypes) => {
        if (!this.additions[comp]) {
            console.error(`There is no ${comp.toUpperCase()} in tile!`);
            return;
        }

        this.sprite.removeChild(this.additions[comp]!.sprite);
        this.additions[comp] = undefined;
    };

    clearTileComps = () => {
        this.setDefaultAdditions();
        this.sprite.removeChild(...this.sprite.children);
    };

    private addTestGraphicsssss = () => {
        const gr = new PIXI.Graphics()
            .beginFill(0xffffff, 0.5)
            .drawRect(
                -this.sprite.width * this.sprite.anchor.x,
                -this.sprite.height * this.sprite.anchor.y,
                this.sprite.width,
                this.sprite.height,
            )
            .endFill();
        gr.zIndex = 1000;
        this.sprite.addChild(gr);
    };
}
