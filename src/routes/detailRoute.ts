import { Actor } from 'apify';
import { CheerioCrawlingContext } from 'crawlee';
import {
    GENERAL_PRODUCT_INFO_GRAPHQL_ID,
    GRAPHQL_PRODUCT_DATA_SEL,
    PRICE_CURRENCY_GRAPHQL_ID,
    PRODUCT_ATTRIBUTES_GRAPHQL_ID,
    PRODUCT_IMAGES_GRAPHQL_ID,
    COLOR_PRICE_CATEGORY_GRAPHQL_ID,
} from '../constants.js';
import { parseRelevantGraphqlData, tryParseReponse } from '../utils.js';
import {
    GraphqlProductResponse,
    GraphqlProductImagesAndSimples,
    GraphqlProductData,
    GraphqlProductAttributes,
    Attribute,
    GraphqlGeneralProductInfo,
    GraphqlColorPriceCategory,
    GraphqlPriceCurrency,
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
    const colorPriceCategory = parseColorPriceCategory(graphqlCache);
    const attributes = parseProductAttributes(graphqlCache);
    const priceCurrency = parsePriceCurrency(graphqlCache);

    const state = await crawler.useState<CrawleeState>();

    if (state.remainingItems <= 0) {
        return;
    }

    state.remainingItems--;

    await Actor.pushData({
        url,
        ...productSimpleInfo,
        ...colorPriceCategory,
        priceCurrency,
        ...generalInfo,
        ...attributes,
    });
};

const parseImagesAndSimpleInfo = (graphqlCache: Record<string, GraphqlProductData>) => {
    const productImages = parseRelevantGraphqlData(
        graphqlCache,
        PRODUCT_IMAGES_GRAPHQL_ID,
        /galleryMedia/,
    )[0] as GraphqlProductImagesAndSimples;

    const { product } = productImages.data;

    const gallery = product.galleryMedia.map((media) => media.uri.replace(/\?.+$/, ''));

    const images = gallery.filter((url) => !url.match(/\.(mp4|avi)/));
    const videos = gallery.filter((url) => url.match(/\.(mp4|avi)/));

    const thumbnail = product.galleryThumbnails[0].uri;

    const { name, sku, brand, comingSoon } = product;

    const flags = product.flags.map((flag) => ({
        ...flag,
        formatted: flag.formatted.replace(/25$/, ''),
    }));

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
        /"hasSample":(true|false),"availabilityStatus"/,
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

const parsePriceCurrency = (graphqlCache: Record<string, GraphqlProductData>) => {
    const priceCurrency = parseRelevantGraphqlData(
        graphqlCache,
        PRICE_CURRENCY_GRAPHQL_ID,
    )[0] as GraphqlPriceCurrency;

    const { simples } = priceCurrency.data.product;

    return simples[0] ? simples[0].offer.price.original.currency : null;
};

const parseColorPriceCategory = (graphqlCache: Record<string, GraphqlProductData>) => {
    const ratingReviews = parseRelevantGraphqlData(
        graphqlCache,
        COLOR_PRICE_CATEGORY_GRAPHQL_ID,
    )[0] as GraphqlColorPriceCategory;

    const { color, displayPrice, category } = ratingReviews.data.product;
    const { original: originalPrice, promotional: promotionalPrice } = displayPrice;

    return {
        category,
        color,
        formattedPrice: {
            original: originalPrice.formatted,
            current: promotionalPrice ? promotionalPrice.formatted : originalPrice.formatted,
            promotional: promotionalPrice ? promotionalPrice.formatted : null,
        },
    };
};
