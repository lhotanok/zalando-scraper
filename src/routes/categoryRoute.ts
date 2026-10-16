import { CheerioCrawlingContext, CheerioRoot } from 'crawlee';
import {
    LABELS,
    PAGES_COUNT_SEL,
} from '../constants.js';
import { enqueuePageProducts } from '../utils.js';

export const categoryRoute = async (context: CheerioCrawlingContext) => {
    const { log, $, request: { url } } = context;

    const pageTitle = $('head title').text();
    log.info(`Opened category page: ${pageTitle}`, { url });

    // Throws before the next pages are queued, so an unparsable category doesn't crawl them all
    await enqueuePageProducts(context);

    await enqueueNextPages(context);
};

const enqueueNextPages = async (context: CheerioCrawlingContext) => {
    const { $, enqueueLinks, log, request: { url } } = context;

    const currentPage = getCurrentPage(url);

    if (new URL(url).searchParams.get('p')) {
        log.info(`Opened page ${currentPage}, not enqueueing next pages.
        If you want to crawl all category pages, remove page parameter 'p=${currentPage}' from your start URL.`, { url });
        return;
    }

    const totalPages = parseTotalPagesCount($, currentPage);
    const nextPageUrls = buildNextPageUrls(url, currentPage, totalPages);

    const { processedRequests } = await enqueueLinks({
        urls: nextPageUrls,
        label: LABELS.PAGE,
        // zalando.de redirects to en.zalando.de, the default 'same-hostname' would skip the pages after it
        strategy: 'same-domain',
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

    // Text with exactly two numbers, such as 'Page 1 of 428'
    const pagesCountText = $(PAGES_COUNT_SEL).toArray()
        .map((span) => $(span).text().trim())
        .find((text) => /^\D*\d+\D+[\d,.]+$/.test(text)) || '';

    return parseInt(
        pagesCountText.replace(replaceCurrentPageRegex, '').replace(/[^\d]+/g, ''),
        10,
    );
};
