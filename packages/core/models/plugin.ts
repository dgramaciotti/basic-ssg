import { AppConfig, Hooks } from "./appConfig.js";

export type Plugin = {
    name: string;
    setup: (config: AppConfig) => Hooks
}
