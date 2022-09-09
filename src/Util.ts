import anime, { AnimeInstance } from "animejs";

export function clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
}

export function waitForEvent(event: string): Promise<void> {
    return new Promise(resolve => {
        document.addEventListener(
            event,
            () => {
                resolve();
            },
            {
                once: true,
            },
        );
    });
}

export function delayedCallback(callback: () => void, time: number) {
    const ticker = PIXI.Ticker.shared;
    let currentTime = 0;

    const process = (delta: number) => {
        currentTime += (1000 / 60) * delta;

        if (currentTime >= time) {
            callback();
            ticker.remove(process);
        }
    };

    ticker.add(process);
    return {
        destroy: () => {
            ticker.remove(process);
        },
    };
}

export function rescale_to_width(target: PIXI.Container, target_width: number) {
    const scale_value = Math.min((target.scale.x * target_width) / target.width, 1);
    target.scale.set(scale_value);

    return scale_value;
}

export function sleep(time: number): Promise<void> {
    return new Promise<void>(resolve => {
        delayedCallback(resolve, time);
    });
}

export function completeAnime(anim: AnimeInstance | null) {
    if (anim && anim.complete) {
        anim.pause();
        anim.complete(anim);
    }
}

export function pausable_sleep(time: number) {
    const params: anime.AnimeParams = {
        duration: time,
    };

    const promise = new Promise(resolve => {
        params.complete = resolve;
    });

    const instance = anime(params);

    return {
        promise,
        instance,
    };
}

/** LOL IT`S REALLY WORKS */
export function logImage(target: PIXI.Container, app: PIXI.Application, quality = 1) {
    const w = target.getLocalBounds().width;
    const h = target.getLocalBounds().height;

    const style = [
        "font-size: 1px;",
        "line-height: " + (h % 2) + "px;",
        "padding: " + h / 2 + "px " + w / 2 + "px;",
        "background: url(" + app.renderer.extract.image(target, "image/png", quality).src + ");",
    ].join(" ");

    console.groupCollapsed("Image Log");
    console.log("%c ", style);
    console.groupEnd();
}
