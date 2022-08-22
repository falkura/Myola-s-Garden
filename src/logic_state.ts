import { Config } from "./Config";
import { AppState } from "./Models";
import { Subject } from "./Observer";

class LogicStateClass extends Subject {
	app_state: AppState = "pre_preloader";

	is_music_on = true;
	are_sound_fx_on = true;

	is_mobile = false;
	is_landscape = true;

	app_width = Config.project_width;
	app_height = Config.project_height;

	constructor() {
		super();
	}
}

export const LogicState = new LogicStateClass();
