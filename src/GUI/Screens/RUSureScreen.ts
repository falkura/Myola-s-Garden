import { Config } from "../../Config";
import { EVENTS } from "../../Events";
import { IScreen } from "../../Models";
import { TextStyles } from "../../TextStyles";
import { Button } from "../Components/Buttons";
import { Plate, PlateLong } from "../Components/Plate";

export class RUSureScreen extends PIXI.Container implements IScreen {
    plate: PlateLong;
    title: PIXI.Text;
    exit: Button;
    yes: Button;
    no: Button;
    line: PIXI.Graphics;

    constructor() {
        super();

        this.plate = new Plate();
        this.plate.setScale(5, 3);
        this.addChild(this.plate);

        this.title = new PIXI.Text("Are you sure?", TextStyles.title);
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

        this.exit = new Button("close_on", "close_off").setEvent(EVENTS.GUI.MainScreen.Exit).setScale(2);
        this.addChild(this.exit);

        this.yes = new Button("empty_big_on", "empty_big_off").setEvent(EVENTS.GUI.MainScreen.RUS.Yes).setText("Yes").setScale(3);
        this.addChild(this.yes);

        this.no = new Button("empty_big_on", "empty_big_off").setEvent(EVENTS.GUI.MainScreen.Exit).setText("No").setScale(3);
        this.addChild(this.no);

        this.baseResize();
    }

    show = () => {
        this.visible = true;
    };

    hide = () => {
        this.visible = false;
    };

    baseResize = () => {
        this.plate.position.set(Config.project_width / 2, Config.project_height / 2);
        this.title.position.set(Config.project_width / 2, this.plate.y - this.plate.height / 2 + this.title.height + 20);

        this.exit.position.set(
            this.plate.x + this.plate.width / 2 - this.exit.width - 2,
            this.plate.y - this.plate.height / 2 + this.exit.height - 12,
        );

        this.yes.position.set(this.plate.x - 90, this.plate.y + 110);

        this.no.position.set(this.plate.x + 90, this.plate.y + 110);
        this.line.position.set(Config.project_width / 2 - this.line.width / 2, this.title.y + 35);
    };
}
