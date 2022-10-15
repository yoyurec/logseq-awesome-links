import { doc, body } from '../DOMContainers';
import {
    globalContext,
    stopLinksObserver
} from '../internal';

import './favicons.css';

// External links favicons
export const setFavicons = async (extLinkList?: NodeListOf<HTMLAnchorElement>) => {
    if (!extLinkList) {
        extLinkList = doc.querySelectorAll('.external-link');
    }
    for (let i = 0; i < extLinkList.length; i++) {
        const extLinkItem = extLinkList[i];
        const oldFav = extLinkList[i].querySelector('.awLinks-fav-icon');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname, protocol } = new URL(extLinkItem.href);
        if ((protocol === 'http:') || (protocol === 'https:')) {
            const faviconValue = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
            const fav = doc.createElement('img');
            fav.src = faviconValue;
            fav.width = 16;
            fav.height = 16;
            fav.classList.add('awLinks-fav-icon');
            extLinkItem.insertAdjacentElement('afterbegin', fav);
        }
    }
}

const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.awLinks-fav-icon');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
}

export const toggleFaviconsFeature = () => {
    if (globalContext.pluginConfig?.featureFaviconsEnabled) {
        faviconsLoad();
    } else {
        faviconsUnload();
    }
}

export const faviconsLoad = async () => {
    if (globalContext.pluginConfig?.featureFaviconsEnabled) {
        setTimeout(() => {
            setFavicons();
        }, 500);
    }
}

export const faviconsUnload = () => {
    removeFavicons();
    if (!globalContext.pluginConfig?.featurePageIconsEnabled && !globalContext.pluginConfig?.featureFaviconsEnabled) {
        stopLinksObserver();
    }
}
