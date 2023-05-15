import { Actor } from 'apify';
import { CheerioCrawlingContext } from 'crawlee';

export const detailRoute = async (context: CheerioCrawlingContext) => {
    const { request, $, log } = context;

    const title = $('head title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    await Actor.pushData({
        url: request.loadedUrl,
        title,
    });
};
