import { CheerioCrawlingContext } from 'crawlee';
import { enqueuePageProducts } from '../utils.js';

export const pageRoute = async (context: CheerioCrawlingContext) => {
    const { log, $, request: { url } } = context;

    const pageTitle = $('head title').text();
    const pageNumber = new URL(url).searchParams.get('p');

    log.info(`Opened page ${pageNumber}: ${pageTitle}`, { url });

    await enqueuePageProducts(context);
};
