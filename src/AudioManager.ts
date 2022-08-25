import { Howl, Howler } from "howler";
import { LogicState } from "./logic_state";

class AudioManager {
    MUSIC: Howl[] = [];
    SOUND_FXS: Howl[] = [];

    constructor() {
        document.body.addEventListener("pointerdown", this.init, {
            once: true,
        });

        window.addEventListener("blur", () => {
            Howler.mute(true);
        });

        window.addEventListener("focus", () => {
            if (LogicState.are_sound_fx_on && LogicState.is_music_on) {
                Howler.mute(false);
            }
        });
    }

    init = () => {
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
