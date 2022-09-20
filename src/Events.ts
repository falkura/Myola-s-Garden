export const EVENTS = {
    System: {
        PreloaderLoaded: "SystemPreloaderLoaded",
    },

    Load: {
        Start: "LoadStart",
        Complete: "LoadComplete",
        Error: "LoadError",
    },

    Map: {
        Created: "MapCreated",
        Click: "MapClick",
        Hover: "MapHover",
    },

    Keyboard: {
        Shift: {
            On: "KeyboardShiftOn",
            Off: "KeyboardShiftOff",
        },
        Move: {
            On: "KeyboardMoveOn",
            Off: "KeyboardMoveOff",
        },
    },

    Actions: {
        Tile: {
            Choosen: "ActionsTileChoosen",
        },
        Inventory: {
            Dropped: "ActionsInventoryDropped",
            Shifted: "ActionsInventoryShifted",
            Create: "ActionsInventoryCreate",
            ShowChest: "ActionsInventoryShowChest",
            HideChest: "ActionsInventoryHideChest",
        },
        Roof: {
            Hover: "ActionsRoofHover",
            Unhover: "ActionsRoofUnhover",
        },
    },

    GUI: {
        Lang: {
            Choose: "GUILangChoose",
            Ok: "GUILangOk",
        },
        MainScreen: {
            NewGame: "GUIMainScreenNewGame",
            Continue: "GUIMainScreenContinue",
            Settings: "GUIMainScreenSettings",
            Credits: "GUIMainScreenCredits",
            Exit: "GUIMainScreenExit",
            RUS: {
                Yes: "GUIMainScreenRUSYes",
                No: "GUIMainScreenRUSNo",
            },
        },
        Settings: {
            Music: "GUISettingsMusic",
            Sounds: "GUISettingsSounds",
            Quality: "GUISettingsQuality",
            FullScreen: "GUISettingsFullScreen",
            Language: "GUISettingsLanguage",
            Mute: "GUISettingsMute",
            FPS: "GUISettingsFPS",
            Vibro: "GUISettingsVibro",
            TextSize: "GUISettingsTextSize",
        },
    },
};
