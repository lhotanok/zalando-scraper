export const LABELS = {
    CATEGORY: 'CATEGORY',
    PAGE: 'PAGE',
    DETAIL: 'DETAIL',
};

export const PRODUCT_LINK_SEL = '[data-card-type="media"][href]';
/** Wrapped in `window.__hydrationDataConsume({...})` */
export const GRAPHQL_PRODUCTS_DATA_SEL = 'script#re-concurrent-data-hydrate';
/** In the format such as: 'Page 1 of 428' */
export const PAGES_COUNT_SEL = 'nav span';

/** Wrapped in `runtime['hydratePartial']({...})`, product data is in one of these scripts */
export const GRAPHQL_PRODUCT_DATA_SEL = 'script[id^="re-ph-"]';

// Check the up-to-date GraphQL IDs in case there's an error parsing the data

export const PRODUCT_IMAGES_GRAPHQL_ID = '9c94feddeb4251c3dc765f9507f692789449dde599bc5ec57fd2d26211739d64';
export const PRODUCT_ATTRIBUTES_GRAPHQL_ID = '992b07b74e31f69d2d8e323612ffe4ffb88f6b73e6a75c4706e26312bb9c3b17';
export const GENERAL_PRODUCT_INFO_GRAPHQL_ID = '0af6e2f0eb9c44bc51253963e94093de8b5c24534ce86657440be8e4b650de63';
export const COLOR_PRICE_CATEGORY_GRAPHQL_ID = '124c10eaaf10b885f86f1e3a582c1783fa69e259b2f9d6c8974d36e78500b7ed';
export const PRICE_CURRENCY_GRAPHQL_ID = 'ae0b20f72e03398da471712776fd8db5059ce6389d3b2fa137012185cc6bbae9';

// Content fallbacks, used only when a GraphQL ID above is not found

export const PRODUCT_IMAGES_DATA_REGEX = /"gallery":\[\{"galleryThumbnails"/;
export const PRODUCT_ATTRIBUTES_DATA_REGEX = /"attributeSuperClusters"/;
export const GENERAL_PRODUCT_INFO_DATA_REGEX = /"hasSample":(true|false),"availabilityStatus"/;
export const COLOR_PRICE_CATEGORY_DATA_REGEX = /"displayPrice":\{"original":\{"formatted"/;
export const PRICE_CURRENCY_DATA_REGEX = /"price":\{"original":\{"amount":\d+,"currency"/;
