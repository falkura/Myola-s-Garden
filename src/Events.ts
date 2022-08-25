export const EVENTS = {
	loading: {
		preloader_loaded: "preloader_loaded",
		project_loaded: "project_loaded",
	},

	Load: {
		Start: "LoadStart",
		Complete: "LoadComplete",
		Error: "LoadError",
	},

	Map: {
		Created: "MapCreated",
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
	},
};
