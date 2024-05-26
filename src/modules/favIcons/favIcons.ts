import { doc, globals } from '../globals';
// import { stopLinksObserver } from '../linksObserver/linksObserver';
import { getPropsByPageName } from '../pageIcons/queries';
import { getBase64FromUrlWithCache, isNeedLowContrastFix } from '../utils';

import './favIcons.css';

type favRecord = {
    format:  'img' | 'svg';
    src: string;
};

// External links favicons
export const setFavicons = async (extLinkList?: HTMLElement[]) => {
    if (!extLinkList) {
        extLinkList = [...doc.querySelectorAll(globals.extLinksSelector)];
    }
    for (let i = 0; i < extLinkList.length; i++) {
        const extLinkItem = extLinkList[i] as HTMLAnchorElement;
        setIconToExtItem(extLinkItem);
        if (globals.pluginConfig.inheritExtColor) {
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
    let faviconData: favRecord = {
        format: 'img',
        src: ''
    };

    faviconData = await getFaviconData(url);

    if (faviconData.format === 'img') {
        // use IMG
        const fav = doc.createElement('img');
        fav.classList.add('awLi-favicon');
        fav.src = faviconData.src;
        extLinkItem.insertAdjacentElement('afterbegin', fav);
        return;
    }
    if (faviconData.format === 'svg') {
        // use default SVG
        extLinkItem.insertAdjacentHTML('afterbegin', faviconData.src);
    }
}

const getFaviconData = async (url: string): Promise<favRecord> => {
    let favIcon: favRecord = {
        format: 'img',
        src: ''
    };
    const { hostname, protocol } = new URL(url);
    // email
    if (protocol === 'message:' || protocol === 'mailto:') {
        return favIcon = {
            format: 'svg',
            src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m3 7 9 6 9-6"/></svg>'
        };
    }
    // tel
    if (protocol === 'tel:') {
        return favIcon = {
            format: 'svg',
            src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
        };
    }
    // logseq
    if (protocol === 'logseq:') {
        return favIcon = {
            format: 'svg',
            src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 80"><rect width="64" height="64" x="8" y="8" fill="#002B34" rx="12"/><path fill="#86C8C8" d="M18.6 18.3c-2 .6-3.2 1.7-4 3.5-2.5 5 1.7 11.8 7.7 12.5 2.4.3 4.1-.3 5.7-2 2.4-2.4 2.7-5.4 1-8.8-1.9-4-6.8-6.4-10.4-5.2ZM41 34.9c-3 .6-4.1 1-7 2.5-6 3-9.4 8.9-8.5 14.4.7 4 4 8.5 8.1 11a26.1 26.1 0 0 0 22 1.4c4.2-1.8 7.8-5 9.4-8.5 1.7-3.6 1.5-8-.6-11.7-1.2-2-4.6-5.2-7-6.5A27.2 27.2 0 0 0 41 34.9Z"/><ellipse cx="44.1" cy="22.1" fill="#86C8C8" rx="8.8" ry="5.5" transform="rotate(-15 44 22)"/></svg>'
        };
    }
    // zotero
    if (protocol === 'zotero:') {
        return favIcon = {
            format: 'svg',
            src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 31"><path fill="#cc2936" d="M15.5 8.4 4 23.4h12V26H0v-2L11.5 8.9H.5V6.3h15Z"/></svg>'
        };
    }
    // local
    if (protocol === 'file:') {
        return favIcon = {
            format: 'svg',
            src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"/></svg>'
        };
    }
    // http - custom
    if (hostname === 'youtu.be') {
        return favIcon = {
            format: 'img',
            src: await getBase64FromUrlWithCache(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://youtube.com&size=32`)
        };

    }
    if (hostname === 'gmail.com' || hostname === 'mail.google.com') {
        return favIcon = {
            format: 'img',
            src: await getBase64FromUrlWithCache(`https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico`)
        }
    }
    if (url.includes('docs.google.com/document')) {
        return favIcon = {
            format: 'img',
            src: await getBase64FromUrlWithCache(`https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico`)
        }
    }
    if (url.includes('docs.google.com/spreadsheets')) {
        return favIcon = {
            format: 'img',
            src: await getBase64FromUrlWithCache(`https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico`)
        }
    }
    if (url.includes('docs.google.com/presentation')) {
        return favIcon = {
            format: 'img',
            src: await getBase64FromUrlWithCache(`https://ssl.gstatic.com/docs/presentations/images/favicon5.ico`)
        }
    }
    if (url.includes('.atlassian.net/jira/') || url.includes('.atlassian.net/browse/')) {
        return favIcon = {
            format: 'svg',
            src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 80 80"><defs><linearGradient id="a" x1="38.1" x2="23.2" y1="18.5" y2="33.5" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-color="#0052cc"/><stop offset="1" stop-color="#2684ff"/></linearGradient><linearGradient xlink:href="#a" id="b" x1="42.1" x2="57" y1="61.5" y2="46.5"/></defs><path d="M74.2 38 43 6.9l-3-3-23.4 23.4L5.9 38a2.9 2.9 0 0 0 0 4l21.4 21.5L40 76.3l23.5-23.5.3-.3L74.2 42a2.9 2.9 0 0 0 0-4.1ZM40 50.8 29.3 40 40 29.4 50.7 40Z" style="fill:#2684ff"/><path d="M40 29.4A18 18 0 0 1 40 4L16.5 27.4 29.3 40 40 29.4Z" style="fill:url(#a)"/><path d="M50.8 40 40 50.8a18 18 0 0 1 0 25.5l23.5-23.5Z" style="fill:url(#b)"/></svg>'
        };
    }
    // http - common
    if (protocol === 'http:' || protocol === 'https:') {
        favIcon = {
            format: 'img',
            src: await getBase64FromUrlWithCache(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${hostname}&size=32`)
        }
        if (favIcon.src === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACiElEQVQ4EaVTzU8TURCf2tJuS7tQtlRb6UKBIkQwkRRSEzkQgyEc6lkOKgcOph78Y+CgjXjDs2i44FXY9AMTlQRUELZapVlouy3d7kKtb0Zr0MSLTvL2zb75eL838xtTvV6H/xELBptMJojeXLCXyobnyog4YhzXYvmCFi6qVSfaeRdXdrfaU1areV5KykmX06rcvzumjY/1ggkR3Jh+bNf1mr8v1D5bLuvR3qDgFbvbBJYIrE1mCIoCrKxsHuzK+Rzvsi29+6DEbTZz9unijEYI8ObBgXOzlcrx9OAlXyDYKUCzwwrDQx1wVDGg089Dt+gR3mxmhcUnaWeoxwMbm/vzDFzmDEKMMNhquRqduT1KwXiGt0vre6iSeAUHNDE0d26NBtAXY9BACQyjFusKuL2Ry+IPb/Y9ZglwuVscdHaknUChqLF/O4jn3V5dP4mhgRJgwSYm+gV0Oi3XrvYB30yvhGa7BS70eGFHPoTJyQHhMK+F0ZesRVVznvXw5Ixv7/C10moEo6OZXbWvlFAF9FVZDOqEABUMRIkMd8GnLwVWg9/RkJF9sA4oDfYQAuzzjqzwvnaRUFxn/X2ZlmGLXAE7AL52B4xHgqAUqrC1nSNuoJkQtLkdqReszz/9aRvq90NOKdOS1nch8TpL555WDp49f3uAMXhACRjD5j4ykuCtf5PP7Fm1b0DIsl/VHGezzP1KwOiZQobFF9YyjSRYQETRENSlVzI8iK9mWlzckpSSCQHVALmN9Az1euDho9Xo8vKGd2rqooA8yBcrwHgCqYR0kMkWci08t/R+W4ljDCanWTg9TJGwGNaNk3vYZ7VUdeKsYJGFNkfSzjXNrSX20s4/h6kB81/271ghG17l+rPTAAAAAElFTkSuQmCC') {
            // is common ugly icon?
            favIcon = {
                format: 'img',
                src: await getBase64FromUrlWithCache(`https://icons.duckduckgo.com/ip3/${hostname}`)
            }
            if (favIcon.src === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkI4OUQxMDdDQTYwMTFFNEJGMThCRkI4NTA4NTkyNkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkI4OUQxMDhDQTYwMTFFNEJGMThCRkI4NTA4NTkyNkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQjg5RDEwNUNBNjAxMUU0QkYxOEJGQjg1MDg1OTI2RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQjg5RDEwNkNBNjAxMUU0QkYxOEJGQjg1MDg1OTI2RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjGq5lQAAAI0SURBVHja1Jo9jsIwEIW9Fh17gBxgD0B63EPPBXIBDkAP/Ub0XIAeeuiTA3CAHID061mNkWXlPzN28qQRQojkffZkPEn8dT6fBYFiHSv8jDCqVGBkOnL8HKXFSNNbHUrHsuN/DNwKv5c6HjpuQ2EWA40nlokxAvANBszIpS9IHwAYub2OteARDMivjqeOFFOtVbLjwRWODpd5W2s8l6ICgFE/9shzQZRaRzz3KICDjp0Ipx16GARwwIsrtDZNELIhbaZg3obYdwVQgdOmKZ1UG0DUlnOBdXBXeVmROssJAyzdVJLOCktV51867ozrRFy1EieE5mGU3tYFSK3EtBzS6SapzZ+YZsJ0vh+ALYN5wQyxtQEUEcC75jcOCGUAYqLKs2kpwdQQ4DmWRLkfCmIl7ZI0Q4j/GYh8N2CEEBEXgC+ISApesUNwA7BD+ABglQ+AO44yy52fnLN5A1DM1Tx45wLwYf4DkM3UPCgDgHym5kG5mYFyhuZLMwOgB8EBf3R8ezL/8WwAbkQAaQUE1xO+mw2QEV0LLgSX+dy9qQddiA5uIDifrV6qVmIgehJCcJl/2qXfbSVSoorEpRI91vZCRUspDK2T2znImvJ0naD5a1W5r+tGU8H3bHPoIpn2badPE4FoXOFlh5y7Bk6bxmuyy3viFMsW1HVf7w5KNN7a4nS9I4MDJYTrRFudT7r2Z33e1Bc4C5RbDdz2gHWrgb1iZ2LYZo+qVPG+2cMFESLgdps/AQYA9D2Sc4DqpGYAAAAASUVORK5CYII=') {
                favIcon = {
                    format: 'svg',
                    src: '<svg class="awLi-favicon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0m.6-3h16.8M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18m1-18a17 17 0 0 1 0 18"/></svg>'
                };
            }
        }
    }
    return favIcon;
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
                if (globals.pluginConfig.fixLowContrast && isNeedLowContrastFix(pageColor, globals.themeBg)) {
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
    const extLinkList = [...doc.querySelectorAll(globals.extLinksSelector)];
    if (extLinkList.length) {
        for (let i = 0; i < extLinkList.length; i++) {
            setColorToExtItem(extLinkList[i]);
        }
    }
}

const removeFaviconsColor = () => {
    const extLinkList = [...doc.querySelectorAll(globals.extLinksSelector)];
    if (extLinkList.length) {
        for (let i = 0; i < extLinkList.length; i++) {
            const extLinkItem = extLinkList[i] as HTMLAnchorElement;
            extLinkItem.style.setProperty('--awLi-color', '');
            extLinkItem.classList.remove('awLi-color', 'awLi-stroke');
        }
    }
}

export const toggleFaviconsFeature = () => {
    if (globals.pluginConfig.faviconsEnabled) {
        faviconsLoad();
    } else {
        faviconsUnload();
    }
}

export const toggleInheritExtColor = () => {
    if (globals.pluginConfig.inheritExtColor) {
        setFaviconsColor();
    } else {
        removeFaviconsColor();
    }
}

export const faviconsLoad = async () => {
    if (globals.pluginConfig.faviconsEnabled) {
        setTimeout(() => {
            globals.favIconsCache = new Map();
            setFavicons();
        }, 500);
    }
}

export const faviconsUnload = () => {
    globals.favIconsCache.clear();
    removeFavicons();
}
