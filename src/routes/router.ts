import {
    createCheerioRouter,
} from 'crawlee';
import {
    LABELS,
} from '../constants.js';
import { categoryRoute } from './categoryRoute.js';
import { detailRoute } from './detailRoute.js';
import { pageRoute } from './pageRoute.js';

export const router = createCheerioRouter();

router.addDefaultHandler(categoryRoute);

router.addHandler(LABELS.CATEGORY, categoryRoute);
router.addHandler(LABELS.PAGE, pageRoute);
router.addHandler(LABELS.DETAIL, detailRoute);
