import { Howl, Howler } from "howler";
import { LogicState } from "./logic_state";
import { SessionConfig } from "./SessionConfig";

class AudioManager {
    MUSIC: Howl[] = [];
    SOUND_FXS: Howl[] = [];

    bg_music?: Howl;
    bg_bonus_music?: Howl;

    spin_sound?: Howl;
    stopSpin?: Howl;

    skatter?: Howl;

    win?: Howl;
    big_win?: Howl;
    big_win_super?: Howl;
    big_win_mega?: Howl;

    multiplier?: Howl;
    goToBonusGame?: Howl;

    free_spin_in?: Howl;
    free_spin_out?: Howl;

    click_sound?: Howl; // ?

    constructor() {
        document.body.addEventListener("pointerdown", this.init, {
            once: true,
        });
    }

    init = () => {
        this.bg_music = new Howl({
            src: `${SessionConfig.ASSETS_ADDRESS}sounds/back1.mp3`,
            autoplay: false,
            loop: true,
        });
        this.MUSIC.push(this.bg_music);

        this.bg_bonus_music = new Howl({
            src: `${SessionConfig.ASSETS_ADDRESS}sounds/back2.mp3`,
            autoplay: false,
            loop: true,
        });
        this.MUSIC.push(this.bg_bonus_music);

        // this.goToBonusGame = new Howl({
        //     src: `${SessionConfig.ASSETS_ADDRESS}sounds/goToBonusGame.mp3`,
        // });
        // this.SOUND_FXS.push(this.goToBonusGame);
    };

    change_fx_volume = (new_volume: number) => {
        for (const fx of this.SOUND_FXS) {
            fx.volume(new_volume);
        }
    };

    change_music_volume = (new_volume: number) => {
        for (const m of this.MUSIC) {
            m.volume(new_volume);
        }
    };
}

export type SoundNames = "click_sound" | "spin_sound";

export const AUDIO_MANAGER = new AudioManager();

window.addEventListener("blur", () => {
    Howler.mute(true);
});

window.addEventListener("focus", () => {
    if (LogicState.are_sound_fx_on && LogicState.is_music_on) {
        Howler.mute(false);
    }
});
