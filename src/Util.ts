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
