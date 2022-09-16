import packageInfo from "../../package.json";

declare global {
    /** Configurations from {@link packageInfo.config|package.json}. */
    const GlobalConfig: typeof packageInfo.config;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).GlobalConfig = packageInfo.config;
