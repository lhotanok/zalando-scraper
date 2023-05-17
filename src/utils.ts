import { log } from 'apify';
import {
    CheerioCrawlingContext,
    CheerioRoot,
    EnqueueLinksOptions,
    Request,
} from 'crawlee';
import {
    GRAPHQL_PRODUCTS_DATA_SEL,
    LABELS,
    SIMPLE_PRODUCT_GRAPHQL_ID,
} from './constants.js';
import { GraphqlSimpleProductsResponse, GraphqlSimpleProduct } from './types/responses/graphql-simple-products.js';

export const categorizeUrls = (urls: string[]) : Request[] => {
    const categorizedRequests = urls.map((url) => {
        let label = LABELS.CATEGORY;

        if (url.match(/\.html$/i)) {
            label = LABELS.DETAIL;
        }

        return new Request({
            url,
            label,
        });
    });

    return categorizedRequests;
};

export const tryParseReponse = <ResponseType>(responseJson: string, infoUrl?: string) : ResponseType => {
    try {
        return JSON.parse(responseJson) as ResponseType;
    } catch (err) {
        log.debug((err as Error).message, { url: infoUrl });
        throw new Error(`Response could not be parsed`);
    }
};

export const enqueueProductDetails = async (
    options: {
        context: CheerioCrawlingContext,
        source: 'API' | 'cards',
        urls?: string[],
        selector?: string,
    },
) => {
    const { context, urls, selector, source } = options;
    const { enqueueLinks, request: { url } } = context;

    const enqueueLinksOptions: EnqueueLinksOptions = {
        selector,
        exclude: [/\/outfits\//i],
        label: LABELS.DETAIL,
        forefront: true,
    };

    if (urls) {
        enqueueLinksOptions.urls = urls;
    }

    const { processedRequests: reqs } = await enqueueLinks(enqueueLinksOptions);

    const enqueuedReqs = reqs.filter((req) => !req.wasAlreadyPresent);
    log.info(`Enqueued ${enqueuedReqs.length} product detail pages from product ${source}`, { url });
};

export const parseGraphqlProductUrls = ($: CheerioRoot, url: string) => {
    const dataJson = $(GRAPHQL_PRODUCTS_DATA_SEL).text();
    const productsResponse: GraphqlSimpleProductsResponse = tryParseReponse(dataJson, url);

    const products: GraphqlSimpleProduct[] = parseRelevantGraphqlData(
        productsResponse.graphqlCache,
        SIMPLE_PRODUCT_GRAPHQL_ID,
    );

    const urls = products.map((product) => product.data.product.uri)
        .filter((productUrl) => !productUrl.match(/\/outfits\//i));

    return urls;
};

export const parseRelevantGraphqlData = <DataType>(
    graphqlCache: Record<string, DataType>, graphqlId: string,
) : DataType[] => {
    const data: DataType[] = Object.entries(graphqlCache)
        .filter((entry) => entry[0].includes(graphqlId))
        .map((entry) => entry[1]);

    return data;
};
