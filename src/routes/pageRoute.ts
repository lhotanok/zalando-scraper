import { CheerioCrawlingContext } from 'crawlee';
import { PRODUCT_LINK_SEL } from '../constants.js';
import { parseGraphqlProductUrls, enqueueProductDetails } from '../utils.js';

export const pageRoute = async (context: CheerioCrawlingContext) => {
    const { log, $, request: { url } } = context;

    const pageTitle = $('head title').text();
    const pageNumber = new URL(url).searchParams.get('p');

    log.info(`Opened page ${pageNumber}: ${pageTitle}`, { url });

    const graphqlProductUrls = parseGraphqlProductUrls($, url);

    await enqueueProductDetails({ context, urls: graphqlProductUrls, source: 'API' });
    await enqueueProductDetails({ context, selector: PRODUCT_LINK_SEL, source: 'cards' });
};
