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

export function rescale_to_width(target_text: PIXI.Container, target_width: number, scale = 0) {
    if (scale) {
        target_text.scale.set(scale);
        return scale;
    }
    const scale_value = Math.min((target_text.scale.x * target_width) / target_text.width, 1);
    target_text.scale.set(scale_value);

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

export function genHitmap(baseTex: PIXI.BaseTexture, threshold = 255): Uint32Array | undefined {
    //check sprite props
    if (!baseTex.resource) {
        //renderTexture
        return;
    }
    const imgSource = (baseTex.resource as PIXI.resources.Resource & { source: HTMLImageElement }).source;
    let canvas = null;
    if (!imgSource) {
        return;
    }
    let context = null;
    if (imgSource instanceof Image) {
        canvas = document.createElement("canvas");
        canvas.width = imgSource.width;
        canvas.height = imgSource.height;
        context = canvas.getContext("2d")!;
        context.drawImage(imgSource, 0, 0);
    } else {
        //unknown source;
        return;
    }

    const w = canvas.width;
    const h = canvas.height;
    const imageData = context.getImageData(0, 0, w, h);
    //create array
    const hitmap = new Uint32Array(Math.ceil((w * h) / 32));
    //fill array
    for (let i = 0; i < w * h; i++) {
        //lower resolution to make it faster
        const ind1 = i % 32;
        const ind2 = (i / 32) | 0;
        //check every 4th value of image data (alpha number; opacity of the pixel)
        //if it's visible add to the array
        if (imageData.data[i * 4 + 3] >= threshold) {
            hitmap[ind2] = hitmap[ind2] | (1 << ind1);
            // console.log(`hitmap[${ind2}]:`, hitmap[ind2]);
        }
    }

    return hitmap;
}
