export type GraphqlSimpleProductsResponse = {
    enrichedEntity: {
        id: string;
        type: 'collection';
        hints: string[];
        rawExternalData: string;
    };
    graphqlCache: Record<string, GraphqlSimpleProduct>;
};

export type GraphqlSimpleProduct = {
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
