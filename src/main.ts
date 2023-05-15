import { Actor } from 'apify';
import { CheerioCrawler, CheerioCrawlingContext } from 'crawlee';
import { router } from './routes/router.js';
import { CrawleeState, InputSchema } from './types.js';

await Actor.init();

const {
    startUrls = [
        'https://www.zalando.co.uk/womens-clothing/',
        'https://www.zalando.co.uk/mens-clothing/',
        'https://www.zalando.co.uk/childrens-clothing/',
    ],
    proxyConfiguration: proxyConfig,
    maxItems = Number.MAX_SAFE_INTEGER,
} = await Actor.getInput<InputSchema>() ?? {};

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfig);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
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

await crawler.run(startUrls);

await Actor.exit();
