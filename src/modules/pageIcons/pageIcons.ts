import fastdom from 'fastdom'

import {
    globalContext,
    root, doc, body, tabsPluginIframe,
    stopLinksObserver, stopTabsObserver,
} from '../internal';
import {
    propsObject,
    getPropsByPageName
} from './queries';
import { isNeedLowContrastFix } from '../utils';

import pageIconsStyles from  './pageIcons.css?inline';

export const toggleIconsFeature = () => {
    pageIconsUnload();
    if (globalContext.pluginConfig.pageIconsEnabled) {
        pageIconsLoad();
    }
}

export const pageIconsLoad = async () => {
    if (!globalContext.pluginConfig.pageIconsEnabled) {
        return;
    }
    body.classList.add('awLi-icons')
    logseq.provideStyle({ key: 'awLi-icon-css', style: pageIconsStyles });
    setTabsCSS();
    pageIconsRender();

    logseq.App.onThemeChanged(() => {
        setTimeout(() => {
            pageIconsRender();
        }, 2000);
    });
    logseq.App.onThemeModeChanged(() => {
        setTimeout(() => {
            pageIconsRender();
        }, 2000);
    });
    logseq.App.onRouteChanged(() => {
        setActiveTabIcon();
    });
}

const pageIconsRender = () => {
    setStrokeColor();
    setTagType();
    setPageIcons();
    setTabIcons();
 }

export const pageIconsUnload = () => {
    body.classList.remove('awLi-icons');
    doc.head.querySelector(`style[data-injected-style="awLi-icon-css-${globalContext.pluginID}"]`)?.remove();
    removePageIcons();
    removeTabIcons();
    removeTabsCSS();
    if (!globalContext.pluginConfig.pageIconsEnabled && !globalContext.pluginConfig.faviconsEnabled) {
        stopLinksObserver();
    }
    if (!globalContext.pluginConfig.pageIconsEnabled) {
        stopTabsObserver();
    }
}

export const setPageIcons = async (context?: Document | HTMLElement) => {
    if (!context) {
        context = doc;
    }
    const titleLinksList = [...context.querySelectorAll(globalContext.titleSelector)];
    if (titleLinksList) {
        setStyleToLinkList(titleLinksList);
    }
    const pageLinksList = [...context.querySelectorAll(globalContext.pageLinksSelector)];
    if (pageLinksList.length) {
        setStyleToLinkList(pageLinksList);
    }
    const sidebarLinksList = [...context.querySelectorAll(globalContext.sidebarLinkSelector)];
    if (sidebarLinksList) {
        setStyleToLinkList(sidebarLinksList);
    }
}

export const setTabIcons = async () => {
    if (!tabsPluginIframe) {
        return;
    }
    if (tabsPluginIframe.contentDocument) {
        const tabLinksList = [...tabsPluginIframe.contentDocument.querySelectorAll(globalContext.tabLinkSelector)];
        if (tabLinksList) {
            setStyleToLinkList(tabLinksList);
        }
    }
}

export const setActiveTabIcon = async () => {
    if (tabsPluginIframe && tabsPluginIframe.contentDocument) {
        const tabLink = tabsPluginIframe.contentDocument.querySelector('.logseq-tab[data-active="true"] .logseq-tab-title') as HTMLElement;
        if (tabLink) {
            processLinkItem(tabLink);
        }
    }
}

export const setStyleToLinkList = (linkList: HTMLElement[], skipFastDOM?: boolean) => {
    if (!linkList.length) {
        return;
    }
    for (let i = 0; i < linkList.length; i++) {
        const linkItem = linkList[i];
        if (skipFastDOM) {
                processLinkItem(linkItem);
        } else {
            fastdom.mutate(() => {
                processLinkItem(linkItem);
            });
        }
    }
}

export const processLinkItem = async (linkItem: HTMLElement) => {
    const linkText = linkItem.textContent;
    if (linkText && !linkText.startsWith(' ')) {
        const pageTitle = linkItem.getAttribute('data-ref') || linkItem.childNodes[1]?.textContent?.trim().toLowerCase() || linkItem.textContent?.trim().toLowerCase() || '';
        if (pageTitle) {
            const pageProps = await getPropsByPageName(pageTitle);
            if (pageProps) {
                setStyleToLinkItem(linkItem, pageProps);
            }
        }
    }
 }

export const setStyleToLinkItem = async (linkItem: HTMLElement, pageProps: propsObject) => {
    linkItem.classList.remove('awLi-stroke');
    // icon
    const pageIcon = pageProps['icon-url'] ? `<img src="${pageProps['icon-url']}" style="width:1em">` : pageProps['icon'];
    const pageIcon2 = pageProps['icon-url2'] ? `<img src="${pageProps['icon-url2']}" style="width:1em">` : pageProps['icon2'];
    if (pageIcon && pageIcon !== 'none') {
        const oldPageIcon = linkItem.querySelector('.awLi-icon');
        const oldPageIcon2 = linkItem.querySelector('.awLi-icon2');
        if (oldPageIcon) {
            if( oldPageIcon2 && oldPageIcon2.innerHTML!=pageIcon2){
                linkItem.insertAdjacentHTML('afterbegin', `<span class="awLi-icon2 awLi-icon">${pageIcon2}</span>`);
                oldPageIcon2.remove();
            }
            if (oldPageIcon.innerHTML !== pageIcon) {
                linkItem.insertAdjacentHTML('afterbegin', `<span class="awLi-icon">${pageIcon}</span>`);
                oldPageIcon.remove();
            }
        } else {
            if(pageIcon2) linkItem.insertAdjacentHTML('afterbegin', `<span class="awLi-icon2 awLi-icon">${pageIcon2}</span>`);
            linkItem.insertAdjacentHTML('afterbegin', `<span class="awLi-icon">${pageIcon}</span>`);
        }
    }
    // color
    const pageColor = pageProps['color'];
    if (pageColor && pageColor !== 'none') {
        const oldPageColor = getComputedStyle(linkItem).getPropertyValue('awLi-color');
        if (!oldPageColor && oldPageColor !== pageColor) {
            linkItem.style.setProperty('--awLi-color', pageColor);
            linkItem.style.setProperty('--ls-tag-text-color', pageColor);
            linkItem.classList.add('awLi-color');
        }
        if (globalContext.pluginConfig.fixLowContrast && isNeedLowContrastFix(pageColor)) {
            linkItem.classList.add('awLi-stroke');
        }
    } else {
        linkItem.classList.remove('awLi-color');
        linkItem.style.removeProperty('--awLi-color');
        linkItem.style.removeProperty('--ls-tag-text-color');
        linkItem.classList.remove('awLi-stroke');
    }
}

export const setTagType = () => {
    const tag = doc.createElement('a');
    tag.classList.add('tag');
    body.insertAdjacentElement('beforeend', tag);
    const tagBg = getComputedStyle(tag).backgroundColor.trim();
    tag.remove();
    if (tagBg !== 'rgba(0, 0, 0, 0)') {
        body.classList.add('awLi-tagHasBg');

    } else {
        body.classList.remove('awLi-tagHasBg');
    }
}

const setStrokeColor = () => {
    globalContext.themeBg = getComputedStyle(root).getPropertyValue('--ls-primary-background-color').trim();
}

const removePageIcons = () => {
    const linksList = [...doc.querySelectorAll(`${globalContext.pageLinksSelector}, ${globalContext.titleSelector}, ${globalContext.sidebarLinkSelector}`)];
    removeStyleFromLinkList(linksList);
}

const removeTabIcons = () => {
    if (!tabsPluginIframe || !tabsPluginIframe.contentDocument) {
        return;
    }
    const linksList = [...tabsPluginIframe.contentDocument.querySelectorAll(globalContext.tabLinkSelector)];
    removeStyleFromLinkList(linksList);
}

const removeStyleFromLinkList = (linkList: Element[]) => {
    if (linkList.length) {
        for (let i = 0; i < linkList.length; i++) {
            const linkItem = linkList[i] as HTMLElement;
            linkItem.style.removeProperty('--awLi-color');
            linkItem.classList.remove('awLi-stroke');
            linkItem.querySelector('.awLi-icon')?.remove();
        }
    }
}

const setTabsCSS = () => {
    if (!tabsPluginIframe) {
        return;
    }
    tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
        'beforeend',
        `<style id="awLi-tab-css">
            .logseq-tab-title {
                color: var(--awLi-color) !important;
            }
            .awLi-icon {
                display: inline-block;
                margin-right: 0.34em;
                font-family: 'Fira Code Nerd Font', 'Fira Code', 'Fira Sans';
                text-align: center;
                line-height: 1em;
            }
            .light .awLi-stroke {
                -webkit-text-stroke: 0.3px #00000088;
            }
            .dark .awLi-stroke {
                -webkit-text-stroke: 0.3px #ffffff88;
            }
            .logseq-tab .text-xs {
                display: none;
            }
        </style>`
    );
}

const removeTabsCSS = () => {
    if (!tabsPluginIframe) {
        return;
    }
    tabsPluginIframe.contentDocument?.getElementById('awLi-tab-css')?.remove();
}