export enum Languages {
    en = "en",
}

export const SessionConfig = {
    ASSETS_ADDRESS: "",
    LANGUAGE: Languages.en,
    LOCALE: "en-US",
};

export type SessionConfigType = typeof SessionConfig;
