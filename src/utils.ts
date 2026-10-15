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
} from './constants.js';
import { GraphqlSimpleProduct } from './types/responses/graphql-simple-products.js';

export const categorizeUrls = (urls: string[]) : Request[] => {
    const categorizedRequests = urls.map((url) => {
        let label = LABELS.CATEGORY;

        if (url.match(/\.html/i)) {
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

/** Unwraps the JSON argument of scripts like `window.__hydrationDataConsume({...})` */
export const unwrapScriptJson = (scriptText: string) : string => {
    const wrappedJson = scriptText.match(/\((\{"[\s\S]*?\})\);?(?:\s*\}\);?)?\s*$/);

    return wrappedJson ? wrappedJson[1] : scriptText;
};

/** Merges GraphQL caches from all scripts matching the selector */
export const parseGraphqlCache = <DataType>($: CheerioRoot, selector: string, url: string) => {
    const graphqlCache: Record<string, DataType> = {};

    $(selector).each((_i, script) => {
        const response: { graphqlCache?: Record<string, DataType>, cache?: Record<string, DataType> } = tryParseReponse(
            unwrapScriptJson($(script).text()),
            url,
        );

        Object.assign(graphqlCache, response.graphqlCache ?? response.cache);
    });

    return graphqlCache;
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
    const graphqlCache = parseGraphqlCache<GraphqlSimpleProduct>($, GRAPHQL_PRODUCTS_DATA_SEL, url);

    const urls = Object.values(graphqlCache)
        .map((product) => product?.data?.product?.uri || '')
        .filter((productUrl) => productUrl && !productUrl.match(/\/outfits\//i));

    return urls;
};

export const parseRelevantGraphqlData = <DataType>(
    graphqlCache: Record<string, DataType>,
    graphqlId: string,
    graphqlData?: RegExp,
) : DataType[] => {
    const entries = Object.entries(graphqlCache);
    const entriesById = entries.filter((entry) => entry[0].includes(graphqlId));

    const data: DataType[] = (entriesById.length > 0 || !graphqlData
        ? entriesById
        : entries.filter((entry) => JSON.stringify(entry[1]).match(graphqlData))
    ).map((entry) => entry[1]);

    return data;
};
