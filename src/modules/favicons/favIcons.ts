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
        const oldFav = extLinkList[i].querySelector('.page-icon.awLinks-link-icon');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname, protocol } = new URL(extLinkList[i].href);
        if ((protocol === 'http:') || (protocol === 'https:')) {
            const faviconValue = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
            const fav = doc.createElement('img');
            fav.src = faviconValue;
            fav.width = 16;
            fav.height = 16;
            fav.classList.add('page-icon', 'awLinks-link-icon');
            extLinkList[i].insertAdjacentElement('afterbegin', fav);
        }
    }
    body.classList.add('is-awesomeLinks-ext');
}

const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.page-icon.awLinks-link-icon');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
    body.classList.remove('is-awesomeLinks-ext');
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
