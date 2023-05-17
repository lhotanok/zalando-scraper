import { Actor } from 'apify';
import { CheerioCrawlingContext } from 'crawlee';
import {
    GENERAL_PRODUCT_INFO_GRAPHQL_ID,
    GRAPHQL_PRODUCT_DATA_SEL,
    PRODUCT_ATTRIBUTES_GRAPHQL_ID,
    PRODUCT_IMAGES_GRAPHQL_ID,
    RATING_REVIEWS_GRAPHQL_ID,
    REVIEW_RATING_TO_NUMBER,
} from '../constants.js';
import { parseRelevantGraphqlData, tryParseReponse } from '../utils.js';
import {
    GraphqlProductResponse,
    GraphqlProductImagesAndSimples,
    GraphqlProductData,
    GraphqlProductAttributes,
    Attribute,
    GraphqlGeneralProductInfo,
    GraphqlRatingReviews,
} from '../types/responses/graphql-product.js';
import { CrawleeState } from '../types/crawlee-state.js';

export const detailRoute = async (context: CheerioCrawlingContext) => {
    const { crawler, request: { url }, $, log } = context;

    const title = $('head title').text();
    log.info(`${title}`, { url });

    const dataJson = $(GRAPHQL_PRODUCT_DATA_SEL).text();
    const productResponse: GraphqlProductResponse = tryParseReponse(dataJson, url);

    const { graphqlCache } = productResponse;

    const generalInfo = parseGeneralProductInfo(graphqlCache);
    const productSimpleInfo = parseImagesAndSimpleInfo(graphqlCache);
    const ratingReviews = parseRatingWithReviews(graphqlCache);
    const attributes = parseProductAttributes(graphqlCache);

    const state = await crawler.useState<CrawleeState>();

    if (state.remainingItems <= 0) {
        return;
    }

    state.remainingItems--;

    await Actor.pushData({
        url,
        ...productSimpleInfo,
        ...ratingReviews,
        ...generalInfo,
        ...attributes,
    });
};

const parseImagesAndSimpleInfo = (graphqlCache: Record<string, GraphqlProductData>) => {
    const productImages = parseRelevantGraphqlData(
        graphqlCache,
        PRODUCT_IMAGES_GRAPHQL_ID,
    )[0] as GraphqlProductImagesAndSimples;

    const { product } = productImages.data;

    const gallery = product.galleryMedia.map((media) => media.uri.replace(/\?.+$/, ''));

    const images = gallery.filter((url) => !url.match(/\.(mp4|avi)/));
    const videos = gallery.filter((url) => url.match(/\.(mp4|avi)/));

    const thumbnail = product.galleryThumbnails[0].uri;

    const { name, sku, brand, flags, comingSoon } = product;

    return { name, sku, brand, flags, comingSoon, thumbnail, images, videos };
};

const parseAttributes = (attributes: Attribute[]) => {
    return attributes.map((attribute) => ({
        key: attribute.key,
        value: decodeURIComponent(attribute.value).replace(/^undefined$/i, ''),
    })).filter((attribute) => attribute.value);
};

const parseProductAttributes = (graphqlCache: Record<string, GraphqlProductData>) => {
    const productAttributes = parseRelevantGraphqlData(
        graphqlCache,
        PRODUCT_ATTRIBUTES_GRAPHQL_ID,
    )[0] as GraphqlProductAttributes;

    const { product: { condition, attributeSuperClusters } } = productAttributes.data;

    const attributeCategories = attributeSuperClusters.map((superCluster) => {
        const attributes: {
            key: string;
            value: string;
        }[] = [];

        superCluster.clusters.forEach((cluster) => {
            attributes.push(...parseAttributes(cluster.attributes));
        });

        return {
            categoryId: superCluster.id,
            categoryName: superCluster.label,
            attributes,
        };
    }).filter((category) => category.attributes.length > 0);

    return { condition, attributeCategories };
};

const parseProductPriceAmount = (amount: number) => amount / 100;

const parseGeneralProductInfo = (graphqlCache: Record<string, GraphqlProductData>) => {
    const productInfo = parseRelevantGraphqlData(
        graphqlCache,
        GENERAL_PRODUCT_INFO_GRAPHQL_ID,
    )[0] as GraphqlGeneralProductInfo;

    const {
        availabilityStatus, sizeAdvice, display_price: price, navigationTargetGroup, simples,
    } = productInfo.data.context;

    const sizes = simples.map(({ size, sku, offer }) => ({
        size,
        sku,
        stockStatus: offer.stock.quantity,
    }));

    return {
        price: {
            original: price.original ? parseProductPriceAmount(price.original.amount) : null,
            current: price.current ? parseProductPriceAmount(price.current.amount) : null,
            promotional: price.promotional ? parseProductPriceAmount(price.promotional.amount) : null,
        },
        sizes,
        available: availabilityStatus === 'AVAILABLE',
        sizeAdvice: sizeAdvice ? sizeAdvice.recommendedOffset : null,
        navigationTargetGroup,
    };
};

const parseRatingWithReviews = (graphqlCache: Record<string, GraphqlProductData>) => {
    const ratingReviews = parseRelevantGraphqlData(
        graphqlCache,
        RATING_REVIEWS_GRAPHQL_ID,
    )[0] as GraphqlRatingReviews;

    const { color, family, simples, displayPrice, category } = ratingReviews.data.product;
    const { original: originalPrice, promotional: promotionalPrice } = displayPrice;

    const userReviews = family.reviews || { edges: [], totalCount: 0 };
    const reviews = userReviews.edges.map((review) => ({
        ...review.node,
        rating: REVIEW_RATING_TO_NUMBER[review.node.rating],
    }));

    const rating = family.rating || {
        totalCount: 0,
        average: null,
        distribution: {
            rating1Count: 0,
            rating2Count: 0,
            rating3Count: 0,
            rating4Count: 0,
            rating5Count: 0,
        },
    };

    return {
        category,
        reviewsCount: userReviews.totalCount,
        ratingCount: rating.totalCount,
        rating: rating.average,
        ratingHistogram: rating.distribution,
        reviews,
        color,
        priceCurrency: simples[0] ? simples[0].offer.price.original.currency : null,
        formattedPrice: {
            original: originalPrice.formatted,
            current: promotionalPrice ? promotionalPrice.formatted : originalPrice.formatted,
            promotional: promotionalPrice ? promotionalPrice.formatted : null,
        },
    };
};
