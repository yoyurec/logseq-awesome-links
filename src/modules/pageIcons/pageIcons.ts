import {
    globalContext,
    doc, body,
    setTitleIcon, removeTitleIcon,
    stopLinksObserver,
    searchProps
} from '../internal';

import './pageIcons.css';

export const setPageIcons = async (linkList?: NodeListOf<HTMLAnchorElement>) => {
    if (!linkList) {
        linkList = doc.querySelectorAll(globalContext.pageLinksSelector);
    }
    for (let i = 0; i < linkList.length; i++) {
        const linkItem = linkList[i];
        const oldPageIcon = linkItem.querySelector('.page-icon.awLinks-page-icon');
        if (oldPageIcon) {
            oldPageIcon.remove();
        }
        const linkText = linkItem.textContent;
        if (linkText && linkText.startsWith(' ')) {
            continue;
        }
        const pageTitle = linkItem.getAttribute('data-ref') || '';
        if (!pageTitle) {
            continue;
        }
        const pageProps = await searchProps(pageTitle);
        if (pageProps) {
            const pageIcon = pageProps['icon'];
            if (pageIcon) {
                linkItem.insertAdjacentHTML('afterbegin', `<span class="page-icon awLinks-page-icon">${pageIcon}</span>`);
            }
            const pageColor = pageProps['color'];
            if (pageColor) {
                linkItem.style.color = pageColor.replaceAll('"', '');
            }
        }
    }
    body.classList.add('is-awesomeLinks-int');
}

const removePageIcons = () => {
    const pageIcons = doc.querySelectorAll('.page-icon.awLinks-page-icon');
    if (pageIcons.length) {
        for (let i = 0; i < pageIcons.length; i++) {
            pageIcons[i].remove();
        }
    }
    body.classList.remove('is-awesomeLinks-int');
}

export const pageIconsLoad = async () => {
    setPageIcons();
    setTitleIcon();
}

export const pageIconsUnload = () => {
    removePageIcons();
    removeTitleIcon();
    if (!globalContext.pluginConfig?.featurePageIconsEnabled && !globalContext.pluginConfig?.featureFaviconsEnabled) {
        stopLinksObserver();
    }
}

export const toggleIconsFeature = () => {
    if (globalContext.pluginConfig?.featurePageIconsEnabled) {
        pageIconsLoad();
    } else {
        pageIconsUnload();
    }
}
