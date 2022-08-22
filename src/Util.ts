/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function get_platform() {
    const agent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
    if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            agent
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            agent.substr(0, 4)
        )
    ) {
        return true;
    } else {
        return false;
    }
}

export function compress(c: string) {
    const x = "charCodeAt";
    const e: any = {};
    const f = c.split("");
    const d = [];
    let a = f[0];
    let g = 256;

    for (let b = 1; b < f.length; b++)
        (c = f[b]),
            null != e[a + c]
                ? (a += c)
                : (d.push(1 < a.length ? e[a] : a[x](0)),
                  (e[a + c] = g),
                  g++,
                  (a = c));
    d.push(1 < a.length ? e[a] : a[x](0));
    for (let b = 0; b < d.length; b++) d[b] = String.fromCharCode(d[b]);
    return d.join("");
}

export function decompress(b: string) {
    let a;
    const e: any = {};
    const d = b.split("");
    let f = d[0];
    let c = f;
    const g = [c];
    let o = 256;
    for (let b = 1; b < d.length; b++)
        (a = d[b].charCodeAt(0)),
            (a = 256 > a ? d[b] : e[a] ? e[a] : f + c),
            g.push(a),
            (c = a.charAt(0)),
            (e[o] = f + c),
            o++,
            (f = a);
    return g.join("");
}
