import { PluginsSettingsUiService } from './plugins-settings-ui.service';
export declare class PluginsSettingsUiController {
    private pluginSettingsUiService;
    constructor(pluginSettingsUiService: PluginsSettingsUiService);
    serveCustomUiAsset(reply: any, pluginName: any, file: any, origin: string, v?: string): Promise<any>;
}
