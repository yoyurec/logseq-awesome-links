import fastdom from 'fastdom'

import { body, doc, globals, propsObject, root } from '../globals';
import { settingsTextToPropsObj, isNeedLowContrastFix, isEmoji, injectPluginCSS, ejectPluginCSS, htmlToElement } from '../utils';
import { getPropsByPageName } from './queries';

import pageIconsStyles from  './pageIcons.css?inline';
import tabsIframeStyles from  './tabsIframe.css?inline';

let tabsPluginIframe: HTMLIFrameElement;

export const toggleIconsFeature = () => {
    pageIconsUnload();
    if (globals.pluginConfig.pageIconsEnabled) {
        pageIconsLoad();
    }
}

export const pageIconsLoad = async () => {
    tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (!globals.pluginConfig.pageIconsEnabled) {
        return;
    }
    body.classList.add('awLi-icons')
    logseq.provideStyle({ key: 'awLi-icon-css', style: pageIconsStyles });
    globals.defaultPageProps = settingsTextToPropsObj(globals.pluginConfig.defaultPageProps);
    globals.defaultJournalProps = settingsTextToPropsObj(globals.pluginConfig.defaultJournalProps);
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
    doc.head.querySelector(`style[data-injected-style="awLi-icon-css-${globals.pluginID}"]`)?.remove();
    removePageIcons();
    removeTabIcons();
    removeTabsCSS();
}

export const setPageIcons = async (context?: Document | HTMLElement) => {
    if (!context) {
        context = doc;
    }
    const titleLinksList = [...context.querySelectorAll(globals.titleSelector)];
    if (titleLinksList) {
        setStyleToLinkList(titleLinksList, true);
    }
    const pageLinksList = [...context.querySelectorAll(globals.pageLinksSelector)];
    if (pageLinksList.length) {
        setStyleToLinkList(pageLinksList, true);
    }
    const sidebarLinksList = [...context.querySelectorAll(globals.sidebarLinkSelector)];
    if (sidebarLinksList) {
        setStyleToLinkList(sidebarLinksList);
    }
}

export const setTabIcons = async () => {
    if (!tabsPluginIframe) {
        return;
    }
    if (tabsPluginIframe.contentDocument) {
        const tabLinksList = [...tabsPluginIframe.contentDocument.querySelectorAll(globals.tabLinkSelector)];
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

export const setStyleToLinkList = (linkList: HTMLElement[], noDefaultIcon?: boolean) => {
    if (!linkList.length) {
        return;
    }
    for (let i = 0; i < linkList.length; i++) {
        const linkItem = linkList[i];
        fastdom.mutate(() => {
            processLinkItem(linkItem, noDefaultIcon);
        });
    }
}

export const processLinkItem = async (linkItem: HTMLElement, noDefaultIcon?: boolean) => {
    const linkText = linkItem.textContent;
    if (linkText && !linkText.startsWith(' ')) {
        const pageTitle = linkItem.getAttribute('data-ref') || linkItem.childNodes[1]?.textContent?.trim() || linkItem.textContent?.trim() || '';
        if (pageTitle) {
            const pageProps = await getPropsByPageName(pageTitle);
            if (pageProps) {
                setIconToLinkItem(linkItem, pageProps, noDefaultIcon);
                setColorToLinkItem(linkItem, pageProps);
            }
        }
    }
 }

const setIconToLinkItem = async (linkItem: HTMLElement, pageProps: propsObject, noDefaultIcon?: boolean) => {
    const pageIcon = pageProps['icon'];
    if (pageIcon === globals.defaultPageProps.icon && noDefaultIcon) {
        return;
    }
    if (pageIcon && pageIcon !== 'none') {
        const oldPageIcon = linkItem.querySelector('.awLi-icon');
        oldPageIcon && oldPageIcon.remove();
        hideTitle(linkItem, pageProps);

        const icontFont = (pageProps.iconFont ?? '').toLowerCase();
        const iconMeta = icontFont === 'tabler' ? ' force-tabler-icons' : ''
        const iconNode = htmlToElement(`<span class="awLi-icon${iconMeta}" data-is-emoji="${isEmoji(pageIcon)}">${pageIcon}</span>`);
        const lastNode = linkItem.childNodes[linkItem.childNodes.length - 1];
        linkItem.insertBefore(iconNode, lastNode);
    }
}

const hideTitle = (linkItem: HTMLElement, pageProps: propsObject) => {
    if (pageProps['hidetitle'] && (linkItem.classList.contains('page-ref') || linkItem.classList.contains('tag'))) {
        linkItem.classList.add('awLi-hideTitle');
        const linkText = linkItem.textContent;
        const titleText = pageProps['hidetitletext'] || '';
        const regexp = new RegExp(titleText, 'i');
        linkItem.textContent = linkText!.replace(regexp, '');
    } else {
        linkItem.classList.remove('awLi-hideTitle');
    }
 }

const setColorToLinkItem = async (linkItem: HTMLElement, pageProps: propsObject) => {
    linkItem.classList.remove('awLi-stroke');
    const pageColor = pageProps['color'];
    if (pageColor && pageColor !== 'none') {
        const oldPageColor = getComputedStyle(linkItem).getPropertyValue('awLi-color');
        if (!oldPageColor && oldPageColor !== pageColor) {
            linkItem.style.setProperty('--awLi-color', pageColor);
            linkItem.style.setProperty('--ls-tag-text-color', pageColor);
            linkItem.classList.add('awLi-color');
        }
        const bg = linkItem.classList.contains('tag') ? globals.themeColor : globals.themeBg
        if (globals.pluginConfig.fixLowContrast && isNeedLowContrastFix(pageColor, bg)) {
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
        globals.tagHasBg = true;

    } else {
        body.classList.remove('awLi-tagHasBg');
        globals.tagHasBg = false;
    }
}

const setStrokeColor = () => {
    globals.themeColor = getComputedStyle(root).getPropertyValue('--ls-primary-text-color').trim();
    globals.themeBg = getComputedStyle(root).getPropertyValue('--ls-primary-background-color').trim();
}

const removePageIcons = () => {
    const linksList = [...doc.querySelectorAll(`${globals.pageLinksSelector}, ${globals.titleSelector}, ${globals.sidebarLinkSelector}`)];
    removeStyleFromLinkList(linksList);
}

const removeTabIcons = () => {
    if (!tabsPluginIframe || !tabsPluginIframe.contentDocument) {
        return;
    }
    const linksList = [...tabsPluginIframe.contentDocument.querySelectorAll(globals.tabLinkSelector)];
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
    injectPluginCSS('logseq-tabs_iframe', 'awLi-tabs-styles', tabsIframeStyles);

}

const removeTabsCSS = () => {
    ejectPluginCSS('logseq-tabs_iframe', 'awLi-tabs-styles');
}
