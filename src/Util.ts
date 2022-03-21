import anime from "animejs";

export function stop_spine_animation(
    anim: PIXI.spine.Spine | undefined | null,
    track_index?: number
) {
    if (anim) {
        anim.skeleton.setToSetupPose();
        if (track_index) {
            anim.state.clearTrack(track_index);
        } else {
            anim.state.clearTrack(0);
        }
        //@ts-ignore
        anim.lastTime = 0;
    }
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        anime({
            duration: ms,
            complete: resolve,
        });
    });
}

export function debug_stop(description = " ") {
    return new Promise<void>((resolve) => {
        const listener = () => {
            document.removeEventListener("click", listener);
            console.log(
                `%c DEBUG PLAY ${description} `,
                "background: #000; color: #00FF00; font-size: 20px"
            );
            resolve();
        };

        document.addEventListener("click", listener);
        console.log(
            `%c DEBUG STOP ${description} `,
            "background: #000; color: #FFFF00; font-size: 20px"
        );
    });
}

export function awaiter(event: string) {
    return new Promise<void>((resolve) => {
        const listener = () => {
            document.removeEventListener(event, listener);
            resolve();
        };

        document.addEventListener(event, listener);
    });
}

/**
 * Calculate coords for equidistant points around center
 * @param  {number} count count of points to find
 * @param  {number} r circle radius
 * @param  {number} cx circle center X
 * @param  {number} cy circle center Y
 */
export function calculateCoordinate(
    count: number,
    r: number,
    cx: number,
    cy: number
): PIXI.Point[] {
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

export function formatTime(time: number): string {
    const date = new Date(time);
    const sz = date.getSeconds() > 9 ? "" : "0";

    return `${date.getMinutes()}:${sz}${date.getSeconds()}`;
}

export function RandomNumber(min: number, max: number) {
    return (
        (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) %
            (max - min + 1)) +
        min
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hitTestRectangle(r1: any, r2: any): boolean {
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

    const combinedHalfWidths = Math.abs(r1.width / 2) + Math.abs(r2.width / 2);
    const combinedHalfHeights =
        Math.abs(r1.height / 2) + Math.abs(r2.height / 2);

    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }

    return hit;
}
