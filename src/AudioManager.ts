import { Howl, Howler } from "howler";
import { Global_Vars } from "./GlobalVariables";

class AudioManager {
    MUSIC: Howl[] = [];
    SOUND_FXS: Howl[] = [];

    initialized = false;

    constructor() {
        document.body.addEventListener("pointerdown", this.init, {
            once: true,
        });

        window.addEventListener("blur", () => {
            Howler.mute(true);
        });

        window.addEventListener("focus", () => {
            if (Global_Vars.are_sound_fx_on && Global_Vars.is_music_on) {
                Howler.mute(false);
            }
        });
    }

    init = () => {
        if (this.initialized) return;
        this.initialized = true;
        // this.some_music = new Howl({
        //     src: [`${SessionConfig.ASSETS_ADDRESS}audio/some_music.mp3`],
        // });
        // this.MUSIC.push(this.some_music);
        // this.some_sound = new Howl({
        //     src: [`${SessionConfig.ASSETS_ADDRESS}audio/some_sound.mp3`],
        // });
        // this.SOUND_FXS.push(this.some_sound);
    };

    /** Change sounds volume. */
    change_fx_volume = (new_volume: number) => {
        for (const fx of this.SOUND_FXS) {
            fx.volume(new_volume);
        }
    };

    /** Change music volume. */
    change_music_volume = (new_volume: number) => {
        for (const m of this.MUSIC) {
            m.volume(new_volume);
        }
    };
}

export const AUDIO_MANAGER = new AudioManager();
