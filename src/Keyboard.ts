import { iMovePath, movePath } from "./Model";

export class Keyboard {
    escapeCallbacks: Array<() => void> = [];
    defaultEscape?: () => void;

    constructor(defaultEscape?: () => void) {
        if (defaultEscape) {
            this.defaultEscape = defaultEscape;
        }
        document.addEventListener("keydown", this.processKeyDown);
        document.addEventListener("keyup", this.processKeyUp);
        document.addEventListener("setEscape", this.setEscape);
        document.addEventListener("removeEscape", this.removeEscape);
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
                case "Escape":
                    this.onEscape();
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

    setEscape = (e: Event) => {
        const callback = (e as CustomEvent<() => void>).detail;
        this.escapeCallbacks.push(callback);
    };

    removeEscape = (e: Event) => {
        const callback = (e as CustomEvent<() => void>).detail;
        this.escapeCallbacks.splice(this.escapeCallbacks.indexOf(callback), 1);
    };

    onEscape = () => {
        if (this.escapeCallbacks.length > 0) {
            const callback = this.escapeCallbacks.pop();

            if (callback) {
                callback();
            }
        } else {
            if (this.defaultEscape) {
                this.defaultEscape();
            } else {
                console.log("empty escape");
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
