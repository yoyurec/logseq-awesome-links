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
        const oldPageIcon = linkItem.querySelector('.awLinks-page-icon');
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
            if (pageIcon && pageIcon !== 'none') {
                linkItem.insertAdjacentHTML('afterbegin', `<span class="awLinks-page-icon">${pageIcon}</span>`);
            }
            const pageColor = pageProps['color'];
            if (pageColor && pageColor !== 'none') {
                if (linkItem.classList.contains('tag') && globalContext.tagHasBg) {
                    linkItem.style.color = '';
                    linkItem.style.backgroundColor = pageColor.toString().replaceAll('"', '');
                } else {
                    linkItem.style.backgroundColor = '';
                    linkItem.style.color = pageColor.toString().replaceAll('"', '');
                }
            }
        }
    }
    body.classList.add('is-awesomeLinks-int');
}

const removePageIcons = () => {
    const pageIcons = doc.querySelectorAll('.awLinks-page-icon');
    if (pageIcons.length) {
        for (let i = 0; i < pageIcons.length; i++) {
            pageIcons[i].remove();
        }
    }
    body.classList.remove('is-awesomeLinks-int');
}

export const pageIconsLoad = async () => {
    setTagType();
    setPageIcons();
    setTitleIcon();
    logseq.App.onThemeChanged(() => {
        setTimeout(() => {
            setTagType();
            setPageIcons();
        }, 1000);
    });
    logseq.App.onThemeModeChanged(() => {
        setTimeout(() => {
            setTagType();
            setPageIcons();
        }, 1000);
    });
}

export const setTagType = () => {
    const tag = doc.createElement('a');
    tag.classList.add('tag');
    body.insertAdjacentElement('beforeend', tag);
    const tagBgColor = getComputedStyle(tag).backgroundColor.trim();
    if (tagBgColor !== 'rgba(0, 0, 0, 0)') {
        globalContext.tagHasBg = true;
    } else {
        globalContext.tagHasBg = false;
    }
    tag.remove();
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
