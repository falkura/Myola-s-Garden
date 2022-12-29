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

export function formatTime(time: number): string {
    const date = new Date(time);
    const sz = date.getSeconds() > 9 ? "" : "0";

    return `${date.getMinutes()}:${sz}${date.getSeconds()}`;
}

export function compress(c: string) {
    const x = "charCodeAt";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {};
    const f = c.split("");
    const d = [];
    let a = f[0];
    let g = 256;

    for (let b = 1; b < f.length; b++)
        (c = f[b]), null != e[a + c] ? (a += c) : (d.push(1 < a.length ? e[a] : a[x](0)), (e[a + c] = g), g++, (a = c));
    d.push(1 < a.length ? e[a] : a[x](0));
    for (let b = 0; b < d.length; b++) d[b] = String.fromCharCode(d[b]);
    return d.join("");
}

export function decompress(b: string) {
    let a;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = {};
    const d = b.split("");
    let f = d[0];
    let c = f;
    const g = [c];
    let o = 256;
    for (let b = 1; b < d.length; b++)
        (a = d[b].charCodeAt(0)), (a = 256 > a ? d[b] : e[a] ? e[a] : f + c), g.push(a), (c = a.charAt(0)), (e[o] = f + c), o++, (f = a);
    return g.join("");
}

/**
 * Calculate coords for equidistant points around center
 * @param  {number} count count of points to find
 * @param  {number} r circle radius
 * @param  {number} cx circle center X
 * @param  {number} cy circle center Y
 */
export function calculateCoordinate(count: number, r: number, cx: number, cy: number): PIXI.Point[] {
    const sectors: PIXI.Point[] = [];
    let startAngle = 0;
    const maxCard = count;

    for (let i = 0; i < count; i++) {
        if (i <= maxCard - 1) {
            const angle = 360 / maxCard;
            const rad = Math.PI / 180;
            const x = cx + r * Math.cos(startAngle * rad);
            const y = cy + r * Math.sin(startAngle * rad);

            startAngle += angle;
            sectors.push(new PIXI.Point(x, y));
        } else {
            const angle = 360 / (count - maxCard);
            const rad = Math.PI / 180;
            const x = cx + r * 2 * Math.cos(startAngle * rad);
            const y = cy + r * 2 * Math.sin(startAngle * rad);

            startAngle += angle;
            sectors.push(new PIXI.Point(x, y));
        }
    }
    return sectors;
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
}
