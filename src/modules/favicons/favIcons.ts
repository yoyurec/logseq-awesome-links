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
    const { hostname } = new URL(url);
    if (!hostname) {
        faviconData = await getFaviconData(url);
    } else {
        if (globalContext.favIconsCache.has(hostname)) {
            faviconData = globalContext.favIconsCache.get(hostname);
        } else {
            faviconData = await getFaviconData(url);
            globalContext.favIconsCache.set(hostname, faviconData);
        }
    }
    const fav = doc.createElement('img');
    fav.classList.add('awLi-favicon');
    fav.src = faviconData;
    extLinkItem.insertAdjacentElement('afterbegin', fav);
}

const getFaviconData = async (url: string): Promise<string> => {
    const { hostname, protocol } = new URL(url);
    if (protocol === 'message:' || protocol === 'mailto:') {
        return await `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAB/lBMVEUAAAD///8defMbtfoauvodgvQdfvEavfgctfcAlPUch/IId/IddvAcbu4YwvsYvvsZw/cdc/IbvfsaxfsYwfsenPcfgf/n9P0bpfkcjfYbiPYaq/QbgfQDifQAg/MCf/MCevEACwwe+v8eiv8Xx/0asfcAo/cBnfcfn/YclfYgk/Yel/UapfMJhfMbnvIbmfIbkfEcd/Ebi/AcdO4mnv8jjv/5/P7O5/0Xxfsbr/sas/kbq/kcnPkaofggpfYCmfYHl/UIk/UbhfIBBxAABAci//8h7/8d1f8c1P8d0v8a0f8ayf8bwv8bu/8jl/8dev/s9v7Y7f0ch/oNqPkddflBvPg9t/gbrfgUq/gckvgUrvcorPYcqPYgo/YGofYHnvYcmPYdkvZIn/VAnfUAjvUUhfUZwvQZofQenPQ7lvQIjvQIi/Qdc/Qdj/MijvMAh/MSgPIUffIMe/IblfEbhvEAdvEAcPEcdPAAX/AcfO8bgu0Zq+wbaeAZY9ETkrQVUq0LV2kMMGUBFxwi9P8e6P8c3/8d3v8mof8jkf/7/P7z+v3i9P3W6v0btP3B5vu24fsbrPsYufoAdfEAbPAYvOwYvOsbfegZpeAaeuAXsNgXr9gac9YXoNUYcM8XnM4WYLYTh7EVXK0SgagOPXQNOm4LUGQKSVwIJ04HIUIDDBit2z+MAAAAAXRSTlMAQObYZgAAAhpJREFUOMt1jAdXGkEUhd8ENGoKCYFlWZbeRGkKWEBAsXdjb7HX2Hvsmt577738y8wMR4/rut/Z8+557347gCnb393eOneMre3d/VIA2odCTGPr9EUB062NTOguNf4GmbVA4KyIQGCNCf4BKA0yOackyGHu/IOfDbiXNBp+wDfreqok69Yv8MmamiIJb/0Ab5t5nl9YPCNicSGF55tfwwaXSMybJjNETJrmExncBixz3KhxCJ3AkHGU45YhV6v1DKNrohqfhj1abS4WZjyzCK3mC+uHLxCa9cxgwd81qM/ClxWBcXkVjyz9YJcf/C7XFBGQKf9I/xwRYcrl8sPSQPbVbEQNzUHftEIDFwNL4CtSl6gRxZCHkhiTMVEyUeQDn/pQ0I/QNzT6kQd0VxerseCNZhZnkvWeEf+Kjfsm/BY1cRH1gpcdd8bwlmcgtysGwzjJOQ1Z4lHWC26W7Y/hfg4J0DchFOtnWTe4I719PehxOjpG/Anq6euNuEH3VNfSjuJIhBO1t0QKdaAr7Oh0tKETaHN0dmBh85Hd3u1wpotwOrrDdpkO3tSnpcnolwySZFLs9ZvwuS4skyRc9xG+V8rkksiqv8LvG/LTksgrfkHZzSq5UqlQKhQKEmTgSTfls+oKM4C5vFKlUKnOC1Gp8LGq/DpgzBbLrZpam+0SpaCADJuttua2xUJ6YuztvH81dkHA2Mt3O3tmXP4Ho7h0w9OVXd8AAAAASUVORK5CYII=`;
    }
    if (protocol === 'logseq:') {
        return await getBase64FromUrl(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://logseq.com&size=32`);
    }
    if (hostname === 'youtu.be') {
        return await getBase64FromUrl(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://youtube.com&size=32`);
    }
    if (hostname === 'gmail.com') {
        return await getBase64FromUrl(`https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico`);
    }
    if (url.includes('docs.google.com/document')) {
        return await getBase64FromUrl(`https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico`);
    }
    if (url.includes('docs.google.com/spreadsheets')) {
         return await getBase64FromUrl(`https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico`);
    }
    if (url.includes('docs.google.com/presentation')) {
        return await getBase64FromUrl(`https://ssl.gstatic.com/docs/presentations/images/favicon5.ico`);
    }
    if (protocol === 'http:' || protocol === 'https:') {
        return await getBase64FromUrl(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${hostname}&size=32`);
    }
    return '';
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
