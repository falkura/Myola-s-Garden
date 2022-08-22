import { Subject } from "./Observer";
import { AppState } from "./Model";
import { Common } from "./Config/Common";

export class LogicStateClass extends Subject {
    is_music_on = true;
    are_sound_fx_on = true;
    music_volume = 1;
    sound_fx_volume = 1;
    is_mobile = false;
    app_state?: AppState;
    is_landscape = false;
    is_fullscreen = false;

    an: any;
    isShift = false;
    sellPrice = 0;
    balance = 1000;

    app_width = Common.game_width;
    app_height = Common.game_height;

    constructor() {
        super();
    }
}

export const change_app_state = (new_state: AppState) => {
    LogicState.app_state = new_state;
};

export const LogicState = new LogicStateClass();
