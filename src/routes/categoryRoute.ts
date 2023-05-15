import { CheerioCrawlingContext, CheerioRoot } from 'crawlee';
import {
    LABELS,
    PAGES_COUNT_SEL,
    PRODUCT_LINK_SEL,
} from '../constants.js';
import { enqueueProductDetails, parseGraphqlProductUrls } from '../utils.js';

export const categoryRoute = async (context: CheerioCrawlingContext) => {
    const { log, $, request: { url } } = context;

    const pageTitle = $('head title').text();
    log.info(`Opened category page: ${pageTitle}`, { url });

    const graphqlProductUrls = parseGraphqlProductUrls($, url);

    await enqueueProductDetails({ context, urls: graphqlProductUrls, source: 'API' });
    await enqueueProductDetails({ context, selector: PRODUCT_LINK_SEL, source: 'cards' });

    await enqueueNextPages(context);
};

const enqueueNextPages = async (context: CheerioCrawlingContext) => {
    const { $, enqueueLinks, log, request: { url } } = context;

    const totalPages = parseTotalPagesCount($);
    const nextPageUrls = buildNextPageUrls(url, totalPages);

    const { processedRequests } = await enqueueLinks({
        urls: nextPageUrls,
        label: LABELS.PAGE,
    });

    const enqueuedPages = processedRequests.filter((req) => !req.wasAlreadyPresent);

    log.info(`Enqueued ${enqueuedPages.length} next product pages`, { url });
};

const buildNextPageUrls = (firstPageUrl: string, totalPages: number) : string[] => {
    const nextPageUrls: string[] = [];

    const nextPageUrl = new URL(firstPageUrl);

    for (let i = 2; i <= totalPages; i++) {
        nextPageUrl.searchParams.set('p', i.toString());

        nextPageUrls.push(nextPageUrl.toString());
    }

    return nextPageUrls;
};

const parseTotalPagesCount = ($: CheerioRoot) : number => {
    const pagesCountText = $(PAGES_COUNT_SEL).text()
        .replace(/ 1 /, '')
        .replace(/[^\d]+/g, '');

    return parseInt(pagesCountText, 10);
};
