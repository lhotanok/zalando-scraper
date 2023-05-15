import { ProxyConfigurationOptions } from 'crawlee';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PRODUCT_GRAPHQL_ID } from './constants.js';

export type InputSchema = {
    startUrls: string[];
    maxItems?: number;
    proxyConfiguration: ProxyConfigurationOptions;
};

export type CrawleeState = {
    remainingItems: number;
};

export type GraphqlProductsResponse = {
    enrichedEntity: {
        id: string;
        type: 'collection';
        hints: string[];
        rawExternalData: string;
    };
    /** Fields holding GraphQL products need to include {@link PRODUCT_GRAPHQL_ID} as a substring. */
    graphqlCache: Record<string, GraphqlProduct>;
};

export type GraphqlProduct = {
    data: {
        product: {
            id: string;
            sku: string;
            name: string;
            navigationTargetGroup: string;
            silhouette: string;
            supplierName: string;
            shortDescription: string | null;
            brandRestriction: {
                themeOverride: string | null;
            };
            brand: {
                name: string;
            };
            basePrice: string | null;
            displayPrice: {
                promotional: {
                formatted: string;
                amount: number;
                lowerBoundLabel: string | null;
                };
                original: {
                formatted: string;
                amount: number;
                lowerBoundLabel: string | null;
                label: string;
                discountLabel: string;
                };
                displayMode: string;
            };
            simples: {
                size: string;
                sku: string;
            }[];
            smallDefaultMedia: UriItem;
            mediumDefaultMedia: UriItem;
            largeDefaultMedia: UriItem;
            smallHoverMedia: UriItem;
            mediumHoverMedia: UriItem;
            largeHoverMedia: UriItem;
            experienceWatermarkLarge: string | null;
            experienceWatermarkMedium: string | null;
            experienceWatermarkSmall: string | null;
            displayFlags: {
                kind: string;
                formatted: string;
            }[];
            uri: string;
            inWishlist: boolean;
            benefits: unknown[],
            reason: string | null;
            sustainability: string | null;
            family: {
                products: {
                edges: unknown[],
                totalCount: number;
                }
            }
        }
    }
}

export type UriItem = {
    uri: string;
};
