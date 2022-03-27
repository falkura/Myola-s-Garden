export const EVENTS = {
    sound_button_clicked: "sound_button_clicked",
    sound_off_button_clicked: "sound_off_button_clicked",
    full_screen: "full_screen",

    Load: {
        Start: "LoadStart",
        Complete: "LoadComplete",
        Error: "LoadError",
    },

    LayerRender: {
        Start: "LayerRenderStart",
        Complete: "LayerRenderComplete",
        Error: "LayerRenderError",
    },

    Buttons: {
        Play: "ButtonsPlay",
        Settings: "ButtonsSettings",
    },

    Setting: {
        ChangeFPS: "SettingChangeFPS",
        Close: "SettingClose",
    },

    Seed: {
        On: "SeedOn",
        Off: "SeedOff",
    },

    Action: {
        Tile: {
            Choose: "ActionTileChoose",
        },

        Plant: {
            Harvest: "ActionPlantHarvest",
        },
    },

    WAILA: {
        Set: "WAILASet",
        Clean: "WAILAClean",
    },
};

export function waitForEvent(event_type: string): Promise<Event> {
    return new Promise((resolve) => {
        document.addEventListener(event_type, resolve, {
            once: true,
        });
    });
}
