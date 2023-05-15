import { log } from 'apify';
import { CheerioCrawlingContext, CheerioRoot, EnqueueLinksOptions } from 'crawlee';
import { GRAPHQL_PRODUCTS_DATA_SEL, LABELS, PRODUCT_GRAPHQL_ID } from './constants.js';
import { GraphqlProductsResponse, GraphqlProduct } from './types.js';

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
    const productsResponse: GraphqlProductsResponse = tryParseReponse(dataJson, url);

    const products: GraphqlProduct[] = Object.entries(productsResponse.graphqlCache)
        .filter((entry) => entry[0].includes(PRODUCT_GRAPHQL_ID))
        .map((entry) => entry[1]);

    const urls = products.map((product) => product.data.product.uri);

    return urls;
};
