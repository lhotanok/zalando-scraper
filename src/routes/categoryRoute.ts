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

    const currentPage = getCurrentPage(url);

    const totalPages = parseTotalPagesCount($, currentPage);
    const nextPageUrls = buildNextPageUrls(url, currentPage, totalPages);

    const { processedRequests } = await enqueueLinks({
        urls: nextPageUrls,
        label: LABELS.PAGE,
    });

    const enqueuedPages = processedRequests.filter((req) => !req.wasAlreadyPresent);

    const nextPage = currentPage + 1;
    const lastPage = currentPage + enqueuedPages.length;

    log.info(
        `Enqueued ${enqueuedPages.length} next product pages (${nextPage}-${lastPage})`,
        { url },
    );
};

const buildNextPageUrls = (
    currentUrl: string, currentPage: number, totalPages: number,
) : string[] => {
    const nextPageUrls: string[] = [];

    const nextPageUrl = new URL(currentUrl);

    for (let i = currentPage + 1; i <= totalPages; i++) {
        nextPageUrl.searchParams.set('p', i.toString());

        nextPageUrls.push(nextPageUrl.toString());
    }

    return nextPageUrls;
};

const getCurrentPage = (url: string): number => {
    const currentPageText = new URL(url).searchParams.get('p') || '1';

    return parseInt(currentPageText, 10);
};

const parseTotalPagesCount = ($: CheerioRoot, currentPage: number) : number => {
    const replaceCurrentPageRegex = new RegExp(` ${currentPage} `);

    const pagesCountText = $(PAGES_COUNT_SEL).text()
        .replace(replaceCurrentPageRegex, '')
        .replace(/[^\d]+/g, '');

    return parseInt(pagesCountText, 10);
};
