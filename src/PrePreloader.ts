import { Config, SessionConfig } from "./Config";
import { EVENTS } from "./Events";
import { AUDIO_MANAGER } from "./AudioManager";
import { ResourceController } from "./ResourceLoader";

export class PrePreloader {
	readonly container: PIXI.Container;
	private readonly app: PIXI.Application;
	private gr?: PIXI.Graphics;

	constructor(app: PIXI.Application) {
		this.app = app;

		this.container = new PIXI.Container();
		this.createLoader();
		this.load_fonts();

		this.update_state();

		this.load_assets().then(this.start_preloader);
	}

	createLoader = () => {
		this.gr = new PIXI.Graphics().lineStyle(15, 0x000000, 1).arc(0, 0, 100, 0, Math.PI);
		this.gr.position.set(Config.project_width / 2, Config.project_height / 2);
		this.container.addChild(this.gr);

		const rotation = () => {
			if (this.gr) this.gr.rotation += 0.1;
		};

		this.app.ticker.add(rotation);

		document.addEventListener(
			EVENTS.loading.preloader_loaded,
			() => {
				this.app.ticker.remove(rotation);
			},
			{
				once: true,
			},
		);
	};

	update_state = () => {
		const url = `${window.location.origin}${window.location.pathname}`.replace("index.html", "");

		SessionConfig.ASSETS_ADDRESS = `${url}assets/`;
		SessionConfig.API_ADDRESS = url;
	};

	load_fonts() {
		ResourceController.loadFonts();
	}

	load_assets() {
		return new Promise<void>(resolve => {
			ResourceController.addResources("preload");
			ResourceController.loadResources(resolve);
		});
	}

	start_preloader() {
		document.dispatchEvent(new Event(EVENTS.loading.preloader_loaded));
		AUDIO_MANAGER.init();
	}

	resize() {
		if (this.gr) this.gr.position.set(Config.project_width / 2, Config.project_height / 2);
	}
}
