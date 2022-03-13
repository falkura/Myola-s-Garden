import { EVENTS } from "../Events";
import { CMStyle } from "./ContextMenuStyle";

// @TODO override HTMLElement into PIXI.DisplayObject
export class ContextMenu {
    panel: HTMLElement;
    scope: HTMLBodyElement;

    constructor() {
        this.scope = document.querySelector("body")!;

        const el = document.querySelector("style");
        el!.innerHTML += CMStyle;

        this.panel = document.createElement("div");
        this.panel.id = "context-menu";
        this.scope!.appendChild(this.panel);

        const normalizePozition = (mouseX: number, mouseY: number) => {
            let { left: scopeOffsetX, top: scopeOffsetY } =
                this.scope!.getBoundingClientRect();

            scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
            scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

            const outOfBoundsOnX =
                mouseX - scopeOffsetX + this.panel!.clientWidth >
                this.scope!.clientWidth;

            const outOfBoundsOnY =
                mouseY - scopeOffsetY + this.panel!.clientHeight >
                this.scope!.clientHeight;

            let normalizedX = mouseX;
            let normalizedY = mouseY;

            if (outOfBoundsOnX) {
                normalizedX =
                    scopeOffsetX +
                    this.scope!.clientWidth -
                    this.panel!.clientWidth;
            }

            if (outOfBoundsOnY) {
                normalizedY =
                    scopeOffsetY +
                    this.scope!.clientHeight -
                    this.panel!.clientHeight;
            }

            return { normalizedX, normalizedY };
        };

        this.scope!.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            // const { clientX: mouseX, clientY: mouseY } = event;

            // const { normalizedX, normalizedY } = normalizePozition(
            //     mouseX,
            //     mouseY
            // );

            // this.panel!.classList.remove("visible");

            // this.panel!.style.top = `${normalizedY}px`;
            // this.panel!.style.left = `${normalizedX}px`;

            // setTimeout(() => {
            //     this.panel!.classList.add("visible");
            // });
        });

        // scope!.addEventListener("click", (e: any) => {
        this.scope!.addEventListener("click", () => {
            // if (e.target.offsetParent != this.panel) {
            this.panel!.classList.remove("visible");
            // }
        });

        this.addContextElement("Build Map", "test", EVENTS.Buttons.Play);
        this.addContextElement("Seed On", "seedon", EVENTS.Seed.On);
        this.addContextElement("Seed Off", "seedoff", EVENTS.Seed.Off);
        this.addContextElement("D&D", "dandd", EVENTS.Debug.DandD);
        this.addContextElement("Set Item", "si", EVENTS.Debug.SetItem);
        this.addContextElement("Remove Item", "ri", EVENTS.Debug.RemoveItem);
    }

    addContextElement = (text: string, id: string, event: string) => {
        if (this.getContextElement(id)) {
            console.log("error");
            return;
        }
        const option = document.createElement("div");

        option.className = "item";
        option.innerText = text;
        option.onclick = () => document.dispatchEvent(new Event(event));

        option.id = id;

        this.panel.appendChild(option);
    };

    getContextElement = (id: string) => {
        const options = this.panel.getElementsByClassName("item");

        for (const option of options) {
            if (option.id === id) return option;
        }

        return undefined;
    };

    removeContextElement = (id: string) => {
        const option = this.getContextElement(id);

        if (option) {
            option.remove();
        } else {
            console.log("error");
        }
    };
}
