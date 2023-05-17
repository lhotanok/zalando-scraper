export type GraphqlProductResponse = {
    enrichedEntity: {
        id: string;
        type: 'app-download-banner';
        hints: string[];
    };
    /** Fields holding GraphQL products need to include {@link PRODUCT_GRAPHQL_ID} as a substring. */
    graphqlCache: Record<string, GraphqlProductData>;
};

export type GraphqlProductData = GraphqlProductImagesAndSimples
    | GraphqlProductAttributes
    | GraphqlGeneralProductInfo
    | GraphqlRatingReviews;

export type GraphqlProductImagesAndSimples = {
    data: {
        product: {
            id: string;
            name: string;
            sku: string;
            uri: string;
            comingSoon: boolean;
            brand: {
                name: string;
                uri: string;
            },
            flags: {
                formatted: string;
                kind: string;
                info: string | null;
            }[];
            galleryThumbnails: {
                __typename: 'Image';
                uri: string;
            }[];
            galleryMedia: {
                __typename: 'Image';
                uri: string;
            }[];
            simplesWithStock: {
                sku: string;
                size: string;
                isSample: boolean;
                allOffers: SizeOffer[];
            }[];
        };
    };
};

export type GraphqlProductAttributes = {
    data: {
        product: {
            id: string;
            name: string;
            sku: string;
            sustainability: string | null;
            attributeSuperClusters: AttributeSuperCluster[];
            brand: {
                name: string;
                id: string;
                followStatus: string | null;
            };
            brandRestriction: {
                themeOverride: string | null;
            };
            condition: string | null;
        };
    };
};

export type GraphqlGeneralProductInfo = {
    data: {
        context: {
            entity_id: string;
            isReviewable: string | null;
            hasSample: boolean;
            availabilityStatus: 'AVAILABLE' | 'UNAVAILABLE',
            purchaseRestriction: {
                isInviteOnlyPurchase: string | null;
            };
            family: {
                rating: null | {
                    average: number;
                    totalCount: number;
                };
                reviews: null | {
                    totalCount: number;
                };
            },
            flags: {
                type: string;
            }[];
            brand: {
                name: string;
                entity_id: string;
            };
            color: {
                name: string;
            },
            display_price: {
                current: null | {
                    amount: number;
                },
                original: null | {
                    amount: number;
                },
                promotional: null | {
                    amount: number;
                },
                displayMode: string;
            },
            navigationTargetGroup: string;
            name: string;
            sizeAdvice: null | {
                recommendedOffset: string;
            };
            simples: SizeWithStockInfo[];
        };
    };
};

export type Review = {
    node: {
        authorName: string;
        publishedAt: string;
        text: string;
        rating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
    };
};

export type GraphqlRatingReviews = {
    data: {
        product: {
            id: string;
            sku: string;
            family: {
            reviews: null | {
                edges: Review[];
                totalCount: number;
            };
            rating: null | {
                distribution: {
                    rating1Count: number;
                    rating3Count: number;
                    rating2Count: number;
                    rating4Count: number;
                    rating5Count: number;
                },
                average: number;
                totalCount: number;
            };
            };
            brand: {
                name: string;
            };
            color: {
                name: string;
                label: string;
            };
            displayPrice: {
                original: {
                    formatted: string;
                },
                promotional: null | {
                    formatted: string;
                };
            };
            category: string;
            simples: {
                size: string;
                sku: string;
                offer: {
                    stock: {
                        quantity: StockStatus;
                    };
                    price: {
                        original: {
                            amount: number;
                            currency: string;
                        };
                        promotional: {
                            amount: number;
                            currency: string;
                        };
                    };
                };
            }[];
        };
    };
};

export type StockStatus = 'OUT_OF_STOCK' | 'MANY' | 'ONE';

export type SizeWithStockInfo = {
    sku: string;
    size: string;
    deliveryOptions: string | null;
    offer: {
        price: {
            promotional: {
            amount: number;
            };
            original: {
            amount: number;
            };
            previous: string | null;
            displayMode: string | null;
        };
        merchant: {
            id: string;
        };
        selectionContext: string | null;
        isMeaningfulOffer: boolean;
        displayFlags: unknown[],
        stock: {
            quantity: StockStatus;
        };
    };
};

export type SizeOffer = {
    isDefaultOffer: boolean;
    selectionContext: string | null;
    displayFlags: {
        formatted: string;
        kind: string;
    }[];
    merchant: {
        id: string;
    },
    price: {
        displayMode: string;
        original: {
            amount: number;
        },
        promotional: string | null;
        previous: string | null;
    };
};

export type Attribute = {
    __typename: 'ProductAttributeKeyValue';
    key: string;
    value: string;
};

export type AttributeCluster = {
    sustainabilityClusterKind: string | null;
    description: string | null;
    label: string | null;
    attributes: Attribute[];
}

export type AttributeSuperCluster = {
    id: string;
    label: string;
    __typename: 'ProductAttributeDefaultSuperCluster';
    clusters: AttributeCluster[];
};
