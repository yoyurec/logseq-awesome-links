import {
    globalContext,
    doc, body,
    setTitleIcon, removeTitleIcon,
    stopLinksObserver,
    searchIcon
} from '../internal';

import './pageIcons.css';

export const setPageIcons = async (linkList?: NodeListOf<HTMLAnchorElement>) => {
    if (!linkList) {
        linkList = doc.querySelectorAll(globalContext.pageLinksSelector);
    }
    for (let i = 0; i < linkList.length; i++) {
        let pageIcon = '';
        let pageTitle = '';
        const linkItem = linkList[i];
        const oldPageIcon = linkItem.querySelector('.page-icon.awLinks-page-icon');
        if (oldPageIcon) {
            oldPageIcon.remove();
        }
        const linkText = linkItem.textContent;
        if (linkText && linkText.startsWith(' ')) {
            continue;
        }
        pageTitle = linkItem.getAttribute('data-ref') || '';
        if (!pageTitle) {
            continue;
        }
        pageIcon = await searchIcon(pageTitle);
        if (pageIcon) {
            linkItem.insertAdjacentHTML('afterbegin', `<span class="page-icon awLinks-page-icon">${pageIcon}</span>`);
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
