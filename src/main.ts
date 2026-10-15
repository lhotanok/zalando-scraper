import { Actor } from 'apify';
import { CheerioCrawler, CheerioCrawlingContext } from 'crawlee';
import { router } from './routes/router.js';
import { CrawleeState } from './types/crawlee-state.js';
import { categorizeUrls } from './utils.js';
import { InputSchema } from './types/input-schema.js';

await Actor.init();

const {
    startUrls = [
        'https://www.zalando.co.uk/womens-clothing/',
        'https://www.zalando.co.uk/mens-clothing/',
        'https://www.zalando.co.uk/childrens-clothing/',
    ],
    proxyConfiguration: proxyConfig = {
        useApifyProxy: true,
    },
    maxItems = Number.MAX_SAFE_INTEGER,
} = await Actor.getInput<InputSchema>() ?? {};

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfig);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    navigationTimeoutSecs: 45,
    preNavigationHooks: [
        async (context: CheerioCrawlingContext) => {
            const { crawler: cheerioCrawler, log } = context;
            const state = await cheerioCrawler.useState<CrawleeState>();

            if (state.remainingItems <= 0) {
                log.info('Reached max items limit, aborting the run');
                await cheerioCrawler.autoscaledPool?.abort();
            }
        },
    ],
});

await crawler.useState<CrawleeState>({
    remainingItems: maxItems,
});

await crawler.run(
    categorizeUrls(startUrls),
);

const { remainingItems } = await crawler.useState<CrawleeState>();

// A run with no items fails, so a Zalando layout change shows up as a failed run
if (maxItems > 0 && remainingItems === maxItems) {
    await Actor.fail('No products found. If your start URLs list products on Zalando, its page layout may have changed (see failed pages in the log).');
}

await Actor.exit();
