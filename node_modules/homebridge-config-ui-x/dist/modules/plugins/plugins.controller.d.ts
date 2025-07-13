import { PluginsService } from './plugins.service';
export declare class PluginsController {
    private pluginsService;
    constructor(pluginsService: PluginsService);
    pluginsGet(): Promise<import("./types").HomebridgePlugin[]>;
    pluginsSearch(query: any): Promise<import("./types").HomebridgePlugin[]>;
    pluginLookup(pluginName: any): Promise<import("./types").HomebridgePlugin>;
    getAvailablePluginVersions(pluginName: any): Promise<import("./types").HomebridgePluginVersions>;
    getPluginConfigSchema(pluginName: any): Promise<any>;
    getPluginChangeLog(pluginName: any): Promise<{
        changelog: string;
    }>;
    getPluginRelease(pluginName: any): Promise<{
        name: any;
        changelog: any;
    }>;
    getPluginAlias(pluginName: any): Promise<import("./types").PluginAlias>;
}
