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

export function distanceBetweenTwoPoints(point1: PIXI.Point, point2: PIXI.Point): number {
    const a = point1.x - point2.x;
    const b = point1.y - point2.y;

    return Math.sqrt(a * a + b * b);
}

/** LOL IT`S REALLY WORKS */
export function logImage(target: PIXI.Container, app: PIXI.Application, quality = 1, title?: string) {
    const w = target.getLocalBounds().width;
    const h = target.getLocalBounds().height;

    const style = [
        "font-size: 1px;",
        "line-height: " + (h % 2) + "px;",
        "padding: " + h / 2 + "px " + w / 2 + "px;",
        "background: url(" + app.renderer.extract.image(target, "image/png", quality).src + ");",
    ].join(" ");

    console.groupCollapsed(`Image Log${title ? " (" + title + ")" : ""}`);
    console.log("%c ", style);
    console.groupEnd();
}

export function genSimpleHitarea(texture: PIXI.Texture): PIXI.Rectangle {
    const src = (texture.baseTexture.resource as PIXI.resources.Resource & { source: HTMLImageElement }).source;
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.drawImage(src, 0, 0, src.width, src.height);
    const data = ctx.getImageData(texture.frame.x, texture.frame.y, texture.frame.width, texture.frame.height);
    const result: number[] = [];
    data.data.forEach((el, i) => {
        if (i !== 0 && (i + 1) % 4 === 0) result.push(el === 0 ? 0 : 1);
    });
    const mtrx = [];
    const size = texture.frame.width;
    for (let i = 0; i < size; i++) {
        mtrx[i] = result.slice(i * size, i * size + size);
    }
    let x = size;
    let w = 0;
    let y = 0;
    let h = size;
    mtrx.forEach((r, i) => {
        if (r.includes(1)) {
            if (y === 0) y = i;
            h = i;
            const li = r.lastIndexOf(1);
            if (li + 1 > w) w = li + 1;
            if (r.indexOf(1) < x) x = r.indexOf(1);
        }
    });
    y -= 1; // WHY MINUS 1 ????
    h -= y - 1;
    w -= x;
    // mtrx.getMatrixSlise(x, y, w, h).logMatrix("Hit Area", true);
    // console.log(x, y, w, h);

    return new PIXI.Rectangle(x, y, w, h);
}

export function genHitmap(baseTexure: PIXI.BaseTexture, threshold = 255): Uint32Array | undefined {
    //check sprite props
    if (!baseTexure.resource) {
        //renderTexture
        return;
    }
    const imgSource = (baseTexure.resource as PIXI.resources.Resource & { source: HTMLImageElement }).source;
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
    // Maybe later:)

    // const PPCB = (e: PIXI.InteractionEvent) => {
    //     if (!e || !e.data) {
    //         // this.emit(event, fn);
    //         // fn();
    //         return;
    //     }
    //     const tempPoint = new PIXI.Point(0, 0);
    //     const point = new PIXI.Point(e.data.global.x, e.data.global.y);
    //     const hitmap = genHitmap(this.texture.baseTexture)!;
    //     this.worldTransform.applyInverse(point, tempPoint);
    //     const width = this.texture.orig.width;
    //     const height = this.texture.orig.height;
    //     const x1 = -width * this.anchor.x;
    //     const y1 = -height * this.anchor.y;
    //     const tex = this.texture;
    //     const res = this.texture.baseTexture.resolution;
    //     const dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
    //     const dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
    //     const ind = dx + dy * this.texture.baseTexture.realWidth;
    //     const ind1 = ind % 32;
    //     const ind2 = (ind / 32) | 0;
    //     const result = (hitmap[ind2] & (1 << ind1)) !== 0;
    //     console.log(result);
    //     if (result) {
    //         // console.log(event, fn);
    //         // this.emit(event);
    //         fn();
    //     }
    // };

    // this.addListener(event, this.hitMap ? PPCB : fn, context);
}
