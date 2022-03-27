import { iMovePath, movePath } from "./Model";

export class Keyboard {
    constructor() {
        document.addEventListener("keydown", this.processKeyDown);
        document.addEventListener("keyup", this.processKeyUp);
    }

    processKeyDown = (e: KeyboardEvent) => {
        if (movePath.hasOwnProperty(e.code)) {
            this.dispatchMovePath(e.code, true);
        } else {
            switch (e.code) {
                case "ShiftLeft":
                case "ShiftRight":
                    document.dispatchEvent(new Event("shiftOn"));
                    break;
                case "KeyI":
                    document.dispatchEvent(new Event("inventoryVisible"));
                    break;
                case "KeyP":
                    document.dispatchEvent(new Event("pi"));
                    break;
                case "KeyC":
                    document.dispatchEvent(new Event("newcolor"));
                    break;
                default:
                    console.log(e.code);
                    break;
            }
        }
    };

    processKeyUp = (e: KeyboardEvent) => {
        if (movePath.hasOwnProperty(e.code)) {
            this.dispatchMovePath(e.code, false);
        } else {
            switch (e.code) {
                case "ShiftLeft":
                case "ShiftRight":
                    document.dispatchEvent(new Event("shiftOff"));
                    break;
                default:
                    // console.log(e.code);
                    break;
            }
        }
    };

    dispatchMovePath = (code: string, on: boolean) => {
        const event = on ? "keyMoveOn" : "keyMoveOff";

        document.dispatchEvent(
            new CustomEvent<iMovePath>(event, {
                detail: movePath[code as keyof typeof movePath],
            })
        );
    };
}
