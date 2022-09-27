import { Config } from "../../Config";
import { Global_Vars } from "../../GlobalVariables";
import { IScreen } from "../../Models";
import { core } from "../../PIXI/core";
import { LoadProcesses, ResourceController } from "../../ResourceLoader";
// import { delayedCallback } from "../../Util";

export class LoaderScreen extends PIXI.Container implements IScreen {
    bg!: core.Sprite;
    progress!: core.AnimatedSprite;
    loadAnimSize = 37;

    constructor() {
        super();
        this.drawLoaderScreen();
        this.resize();
        this.visible = false;
    }

    drawLoaderScreen = () => {
        this.bg = ResourceController.getSprite("city");
        this.bg.anchor.set(0.5, 0.5);
        this.addChild(this.bg);

        const animArray = () => {
            const arr: PIXI.Texture[] = [];
            for (let i = 0; i < this.loadAnimSize; i++) {
                arr.push(ResourceController.getTexture(`${i}_load`));
            }

            return arr;
        };

        this.progress = new core.AnimatedSprite(animArray());
        this.progress.anchor.set(0.5);
        this.progress.scale.set(5);
        this.addChild(this.progress);
    };

    /**
     *
     * @param progress number from 0 to 100
     */
    update = (progress?: number) => {
        if (!progress) {
            this.progress.gotoAndStop(0);
            return;
        }

        const frame = Math.floor((progress / 100) * this.loadAnimSize);
        this.progress.play();
        this.progress.loop = false;
        this.progress.onFrameChange = () => {
            if (this.progress.currentFrame >= frame) this.progress.stop();
        };
    };

    show = (_type?: LoadProcesses) => {
        // this.bg.texture = ResourceController.getTexture(`${_type}_bg`);

        this.visible = true;
        this.update();
    };

    hide = () => {
        return new Promise<void>(resolve => {
            this.update(100);

            const onComplete = () => {
                this.visible = false;

                this.progress.onComplete = () => {};
                this.update();
                resolve();
            };

            if (Global_Vars.fast_load) {
                onComplete();
            } else {
                this.progress.onComplete = onComplete;
            }
        });
    };

    resize = () => {
        this.bg.position.set(Config.project_width / 2, Config.project_height / 2);

        this.bg.scale.set(
            Config.project_width / this.bg.texture.width > Config.project_height / this.bg.texture.height
                ? Config.project_width / this.bg.texture.width
                : Config.project_height / this.bg.texture.height,
        );

        this.progress.position.set(Config.project_width - this.progress.width * 2, Config.project_height - this.progress.height * 2);
    };
}
