import { EVENTS } from "./Events";
import { IMovePath, movePath } from "./Models";

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
                    document.dispatchEvent(new Event(EVENTS.Keyboard.Shift.On));
                    break;
                case "KeyI":
                    // document.dispatchEvent(new Event("inventoryVisible"));
                    break;
                case "Escape":
                    document.dispatchEvent(new Event(EVENTS.GUI.MainScreen.Exit));
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
                    document.dispatchEvent(new Event(EVENTS.Keyboard.Shift.Off));
                    break;
                case "AltLeft":
                case "AltRight":
                    e.preventDefault();
                    break;
                default:
                    // console.log(e.code);
                    break;
            }
        }
    };

    dispatchMovePath = (code: string, on: boolean) => {
        const event = on ? EVENTS.Keyboard.Move.On : EVENTS.Keyboard.Move.Off;

        document.dispatchEvent(
            new CustomEvent<IMovePath>(event, {
                detail: movePath[code as keyof typeof movePath],
            }),
        );
    };
}
