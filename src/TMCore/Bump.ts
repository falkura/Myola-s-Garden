export function hitTestPoint(point: PIXI.Point, sprite: PIXI.Sprite) {
    const xAnchorOffset =
        sprite.anchor !== undefined ? sprite.width * sprite.anchor.x : 0;

    const yAnchorOffset =
        sprite.anchor !== undefined ? sprite.height * sprite.anchor.y : 0;

    const left = sprite.x - xAnchorOffset;
    const right = sprite.x + sprite.width - xAnchorOffset;
    const top = sprite.y - yAnchorOffset;
    const bottom = sprite.y + sprite.height - yAnchorOffset;

    const hit =
        point.x > left && point.x < right && point.y > top && point.y < bottom;

    return hit;
}

export function hitTestRectangle(r1: any, r2: any): boolean {
    //Add collision properties
    let hit = false;

    const xAnchorOffset = r1.anchor !== undefined ? r1.width * r1.anchor.x : 0;

    const yAnchorOffset = r1.anchor !== undefined ? r1.height * r1.anchor.y : 0;

    const xAnchorOffset_ = r2.anchor !== undefined ? r2.width * r2.anchor.x : 0;

    const yAnchorOffset_ =
        r2.anchor !== undefined ? r2.height * r2.anchor.y : 0;

    const vx =
        r1.x +
        Math.abs(r1.width / 2) -
        xAnchorOffset -
        (r2.x + Math.abs(r2.width / 2) - xAnchorOffset_);
    const vy =
        r1.y +
        Math.abs(r1.height / 2) -
        yAnchorOffset -
        (r2.y + Math.abs(r2.height / 2) - yAnchorOffset_);

    //Figure out the combined half-widths and half-heights
    const combinedHalfWidths = Math.abs(r1.width / 2) + Math.abs(r2.width / 2);
    const combinedHalfHeights =
        Math.abs(r1.height / 2) + Math.abs(r2.height / 2);

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        } else {
            //There's no collision on the y axis
            hit = false;
        }
    } else {
        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
}
// }

// export function boxBox(x1, y1, w1, h1, x2, y2, w2, h2) {
//     return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
// }
