import {
    doc,
    globalContext,
    stopLinksObserver
} from '../internal';
import { getBase64FromUrl } from '../utils';

import './favicons.css';

// External links favicons
export const setFavicons = async (extLinkList?: HTMLElement[]) => {
    if (!extLinkList) {
        extLinkList = [...doc.querySelectorAll(globalContext.extLinksSelector)];
    }
    for (let i = 0; i < extLinkList.length; i++) {
        const extLinkItem = extLinkList[i] as HTMLAnchorElement;
        const oldFav = extLinkList[i].querySelector('.awLi-favicon');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname, protocol } = new URL(extLinkItem.href);
        if ((protocol === 'http:') || (protocol === 'https:')) {
            let faviconData = null;
            if (globalContext.favIconsCache.has(hostname)) {
                faviconData = globalContext.favIconsCache.get(hostname);
            }
            if (!faviconData) {
                faviconData = await getBase64FromUrl(`https://t3.gstatic.com/faviconV2?url=${protocol}${hostname}&size=32&client=social`);
                globalContext.favIconsCache.set(hostname, faviconData);

            }
            const fav = doc.createElement('img');
            fav.classList.add('awLi-favicon');
            fav.src = faviconData;
            extLinkItem.insertAdjacentElement('afterbegin', fav);
        }
    }
}

const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.awLi-favicon');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
}

export const toggleFaviconsFeature = () => {
    if (globalContext.pluginConfig.faviconsEnabled) {
        faviconsLoad();
    } else {
        faviconsUnload();
    }
}

export const faviconsLoad = async () => {
    if (globalContext.pluginConfig.faviconsEnabled) {
        setTimeout(() => {
            globalContext.favIconsCache = new Map();
            setFavicons();
        }, 500);
    }
}

export const faviconsUnload = () => {
    globalContext.favIconsCache.clear();
    removeFavicons();
    if (!globalContext.pluginConfig.pageIconsEnabled && !globalContext.pluginConfig.faviconsEnabled) {
        stopLinksObserver();
    }
}
