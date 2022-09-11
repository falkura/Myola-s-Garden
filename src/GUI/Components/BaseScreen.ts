import { Config } from "../../Config";
import { EVENTS } from "../../Events";
import { TextStyles } from "../../TextStyles";
import { Button } from "./Button";
import { Plate } from "./Plate";

export class BaseScreen extends PIXI.Container {
    plate: Plate;
    title: PIXI.Text;
    exit: Button;
    line: PIXI.Graphics;

    constructor(title: string) {
        super();

        this.plate = new Plate();
        this.plate.setScale(5);
        this.addChild(this.plate);

        this.title = new PIXI.Text(title, TextStyles.title);
        this.title.anchor.set(0.5, 0.5);
        this.addChild(this.title);

        this.line = new PIXI.Graphics()
            .beginFill(0xa5755c, 1)
            .drawPolygon([
                new PIXI.Point(0, 3),
                new PIXI.Point(10, 0),
                new PIXI.Point(400, 0),
                new PIXI.Point(410, 3),
                new PIXI.Point(400, 6),
                new PIXI.Point(10, 6),
            ])
            .endFill();

        this.addChild(this.line);

        this.exit = new Button("close_on", "close_off");
        this.exit.event = EVENTS.GUI.MainScreen.Exit;
        this.exit.setScale(2);
        this.addChild(this.exit);

        this.baseResize();
    }

    baseResize = () => {
        this.plate.position.set(Config.project_width / 2, Config.project_height / 2);
        this.title.position.set(Config.project_width / 2, this.plate.y - this.plate.height / 2 + this.title.height + 60);
        this.exit.position.set(
            this.plate.x + this.plate.width / 2 - this.exit.width - 2,
            this.plate.y - this.plate.height / 2 + this.exit.height + 11,
        );
        this.line.position.set(Config.project_width / 2 - this.line.width / 2, this.title.y + 40);
    };
}
