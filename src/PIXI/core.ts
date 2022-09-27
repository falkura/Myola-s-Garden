/* eslint-disable @typescript-eslint/no-namespace */
export namespace core {
    export class Spine extends PIXI.spine.Spine {
        callback?: () => void;

        constructor(skeletonData: PIXI.spine.core.SkeletonData) {
            super(skeletonData);
        }

        setOnClick = (callback: () => void, once = true) => {
            if (!this.interactive) {
                this.interactive = true;
                this.cursor = "pointer";
                this.callback = once
                    ? () => {
                          callback();
                          this.removeOnClick();
                      }
                    : callback;
                this.addListener("pointerdown", this.callback);
            }
        };

        removeOnClick = () => {
            if (this.interactive) {
                this.interactive = false;
                this.cursor = "";
                this.removeListener("pointerdown", this.callback);
                this.callback = () => {};
            }
        };

        pause = () => {
            this.state.timeScale = 0;
        };

        play = () => {
            this.state.timeScale = 1;
        };

        finalize = () => {
            this.state.clearTracks();
            this.state.clearListeners();
            this.skeleton.setToSetupPose();

            this.lastTime = 0;
        };

        setTextForSlot = (slotName: string, ...args: PIXI.Text[]) => {
            const slotIndex = this.skeleton.findSlotIndex(slotName);
            if (slotIndex === -1) console.error(`There is no slot with name ${slotName} in animation.`);

            const slotContainer = this.slotContainers[slotIndex];
            const container = new PIXI.Container();

            const addNewText = (target: PIXI.Text) => {
                target.text += " ";
                target.position.x = container.width;
                container.addChild(target);
            };

            args.forEach((text, index) => {
                addNewText(text);

                if (index === args.length - 1) {
                    text.text = text.text.slice(0, -1);
                }
            });

            container.pivot.set(container.width / 2, container.height / 2);
            container.scale.y = -1;

            slotContainer.addChild(container);
        };

        removeTextsFromSlot = (slot: string, ...args: PIXI.Text[]) => {
            const slotIndex = this.skeleton.findSlotIndex(slot);
            if (slotIndex === -1) console.error(`There is no slot with name ${slot} in animation.`);

            const slotContainer = this.slotContainers[slotIndex];

            args.forEach(text => {
                slotContainer.removeChild(text);
            });
        };
    }

    export class Text extends PIXI.Text {
        constructor(
            text: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style?: any | PIXI.TextStyle,
            canvas?: HTMLCanvasElement | undefined,
        ) {
            super(text, style, canvas);
        }
    }

    /**
     * The core.Sprite class extends the {@link PIXI.Sprite} with some useful function.
     *
     * A sprite can be created from resources that you added in Assets.
     *
     * Typical usage:
     *
     * ```ts
     * let sprite = ResourceController.getSprite('image.png');
     * ```
     *
     * @class
     * @extends PIXI.Sprite
     * @memberof core
     */
    export class Sprite extends PIXI.Sprite {
        constructor(texture?: PIXI.Texture | undefined) {
            super(texture);
        }

        clone = (): core.Sprite => {
            return new core.Sprite(this.texture);
        };
    }

    export class AnimatedSprite extends PIXI.AnimatedSprite {
        constructor(textures: PIXI.Texture[] | PIXI.AnimatedSprite.FrameObject[], autoUpdate?: boolean) {
            super(textures, autoUpdate);
        }

        clone = (): core.AnimatedSprite => {
            return new core.AnimatedSprite(this.textures);
        };
    }
}

// export const PullOfSprites: core.Sprite[] = [];
