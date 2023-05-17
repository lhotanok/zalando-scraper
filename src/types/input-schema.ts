import { ProxyConfigurationOptions } from 'crawlee';

export type InputSchema = {
    startUrls: string[];
    maxItems?: number;
    proxyConfiguration: ProxyConfigurationOptions;
};
