import * as PIXI from "pixi.js";
import { LogicState } from "./logic_state";
import { PrePreloader } from "./PrePreloader";
import { Preloader } from "./Preloader";
import { Main } from "./Main";
import { Config } from "./Config";
import { EVENTS } from "./Events";
import { get_platform } from "./Util";
import { ResourceController } from "./ResourceLoader";

export class App {
	readonly canvas: HTMLCanvasElement;
	readonly app: PIXI.Application;
	readonly is_landscape: boolean = true;
	pre_preloader?: PrePreloader;
	preloader?: Preloader;
	main?: Main;

	constructor() {
		LogicState.is_mobile = get_platform();
		this.canvas = document.getElementById("root") as HTMLCanvasElement;

		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.canvas.style.marginTop = "0";
		this.canvas.style.marginLeft = "0";

		this.app = this.get_pixi_app();

		this.setup_events();
		this.load_preloader();

		window.onresize = this.on_resize;
		this.on_resize();
	}

	get_pixi_app = () => {
		PIXI.settings.ROUND_PIXELS = true;
		PIXI.settings.SORTABLE_CHILDREN = true;

		return new PIXI.Application({
			width: Config.project_width,
			height: Config.project_height,
			view: this.canvas,
			sharedLoader: true,
			sharedTicker: true,
			transparent: true,
		});
	};

	on_resize = () => {
		if (window.innerWidth < window.innerHeight) {
			const multiplier = window.innerWidth / LogicState.app_width;
			const target_height = window.innerHeight / multiplier;

			this.app.renderer.resize(LogicState.app_width, target_height);

			LogicState.is_landscape = false;
		} else {
			const multiplier = window.innerHeight / LogicState.app_height;
			const target_width = window.innerWidth / multiplier;

			this.app.renderer.resize(target_width, LogicState.app_height);

			LogicState.is_landscape = true;
		}

		Config.project_width = this.app.view.width;
		Config.project_height = this.app.view.height;

		LogicState.notify_all();

		if (this.main) {
			this.main.resize();
		} else if (this.preloader) {
			this.preloader.resize();
		} else if (this.pre_preloader) {
			this.pre_preloader.resize();
		}
	};

	load_preloader = () => {
		this.pre_preloader = new PrePreloader(this.app);
		this.app.stage.addChild(this.pre_preloader.container);
	};

	on_preloader_loaded = () => {
		if (this.pre_preloader) {
			this.app.stage.removeChild(this.pre_preloader.container);
		}

		this.preloader = new Preloader(this.app);
		this.app.stage.addChild(this.preloader.container);
		LogicState.app_state = "preloader";
		LogicState.notify_all();
	};

	on_project_loaded = () => {
		this.app.stage.removeChild(this.preloader!.container);

		this.main = new Main(this.app);

		Object.assign(globalThis, {
			main: this.main,
			ls: LogicState,
			app: this,
			rc: ResourceController,
			config: Config,
		});

		this.app.stage.addChildAt(this.main.container, 0);

		LogicState.app_state = "idle";
		LogicState.notify_all();

		Object.assign(window as any, {
			Game: this.game,
			ls: LogicState,
			app: this,
			Common: Common,
		});
	};

	setup_events = () => {
		document.addEventListener(EVENTS.loading.preloader_loaded, this.on_preloader_loaded);
		document.addEventListener(EVENTS.loading.project_loaded, this.on_project_loaded);
	};
}
