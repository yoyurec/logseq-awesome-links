import {
    doc,
    getPropsByPageName,
    globalContext,
    stopLinksObserver
} from '../internal';
import { getBase64FromUrl, isNeedLowContrastFix } from '../utils';

import './favicons.css';

// External links favicons
export const setFavicons = async (extLinkList?: HTMLElement[]) => {
    if (!extLinkList) {
        extLinkList = [...doc.querySelectorAll(globalContext.extLinksSelector)];
    }
    for (let i = 0; i < extLinkList.length; i++) {
        const extLinkItem = extLinkList[i] as HTMLAnchorElement;
        setIconToExtItem(extLinkItem);
        if (globalContext.pluginConfig.inheritExtColor) {
            setColorToExtItem(extLinkItem);
        }
    }
}

const setIconToExtItem = async (extLinkItem: HTMLAnchorElement) => {
    const oldFav = extLinkItem.querySelector('.awLi-favicon');
    if (oldFav) {
        oldFav.remove();
    }
    const url = extLinkItem.href;
    let faviconData = '';
    const { hostname, protocol } = new URL(url);
    if (globalContext.favIconsCache.has(hostname)) {
        faviconData = globalContext.favIconsCache.get(hostname);
    } else {
        faviconData = await getFaviconData(url);
        globalContext.favIconsCache.set(hostname, faviconData);
    }
    const fav = doc.createElement('img');
    fav.classList.add('awLi-favicon');
    fav.src = faviconData;
    extLinkItem.insertAdjacentElement('afterbegin', fav);
}

const getFaviconData = async (url: string): Promise<string> => {
    let faviconData = '';
    const { hostname, protocol } = new URL(url);
    if (protocol === 'logseq:') {
        faviconData = await getBase64FromUrl(`https://t3.gstatic.com/faviconV2?url=https://logseq.com&size=32&client=SOCIAL&fallback_opts=TYPE,SIZE,UR`);
    }
    if (url.includes('docs.google.com/document')) {
        faviconData =  await getBase64FromUrl(`https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico`);
    }
    if (url.includes('docs.google.com/spreadsheets')) {
         faviconData = await getBase64FromUrl(`https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico`);
    }
    if (url.includes('docs.google.com/presentation')) {
         faviconData = await getBase64FromUrl(`https://ssl.gstatic.com/docs/presentations/images/favicon5.ico`);
    }
    if (!faviconData) {
        faviconData = await getBase64FromUrl(`https://t3.gstatic.com/faviconV2?url=${protocol}${hostname}&size=32&client=SOCIAL&fallback_opts=TYPE,SIZE,UR`);
    }

    return faviconData;
}

const setColorToExtItem = async (extLinkItem: HTMLAnchorElement) => {
    const parentRef = extLinkItem.closest('.ls-block[data-refs-self]');
    if (!parentRef) {
        return;
    }
    const refPageAttr = parentRef.getAttribute('data-refs-self') || '';
    const refPageArray = JSON.parse(refPageAttr);
    if (!refPageArray.length) {
        return;
    }
    const refPageTitle = refPageArray[0].toLowerCase();
    if (refPageTitle) {
        const pageProps = await getPropsByPageName(refPageTitle);
        if (pageProps) {
            const pageColor = pageProps['color'];
            if (pageColor && pageColor !== 'none') {
                extLinkItem.style.setProperty('--awLi-color', pageColor);
                extLinkItem.classList.add('awLi-color');
                if (globalContext.pluginConfig.fixLowContrast && isNeedLowContrastFix(pageColor, globalContext.themeBg)) {
                    extLinkItem.classList.add('awLi-stroke');
                }
            }
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

const setFaviconsColor = () => {
    const extLinkList = [...doc.querySelectorAll(globalContext.extLinksSelector)];
    if (extLinkList.length) {
        for (let i = 0; i < extLinkList.length; i++) {
            setColorToExtItem(extLinkList[i]);
        }
    }
}

const removeFaviconsColor = () => {
    const extLinkList = [...doc.querySelectorAll(globalContext.extLinksSelector)];
    if (extLinkList.length) {
        for (let i = 0; i < extLinkList.length; i++) {
            const extLinkItem = extLinkList[i] as HTMLAnchorElement;
            extLinkItem.style.setProperty('--awLi-color', '');
            extLinkItem.classList.remove('awLi-color', 'awLi-stroke');
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

export const toggleInheritExtColor = () => {
    if (globalContext.pluginConfig.inheritExtColor) {
        setFaviconsColor();
    } else {
        removeFaviconsColor();
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
