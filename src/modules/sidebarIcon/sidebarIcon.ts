import {
    doc,
    globalContext,
    searchProps
} from '../internal';

import './sidebarIcon.css';

export const setSidebarIcons = async (sidebarLinksList?: NodeListOf<HTMLAnchorElement> | HTMLAnchorElement[]) => {
    if (!sidebarLinksList) {
        sidebarLinksList = doc.querySelectorAll('.nav-contents-container :is(.favorite-item , .recent-item) .items-center');
    }
    for (let i = 0; i < sidebarLinksList.length; i++) {
        const sidebarLinkItem = sidebarLinksList[i];
        const pageTitle = sidebarLinkItem.querySelector('.page-title')?.textContent;
        if (!pageTitle) {
            continue;
        }
        const oldPageIcon = sidebarLinkItem.querySelector('.awLinks-sidebar-icon');
        if (oldPageIcon) {
            oldPageIcon.remove();
        }
        const pageProps = await searchProps(pageTitle);
        if (pageProps) {
            const pageIcon = pageProps['icon'];
            if (pageIcon) {
                sidebarLinkItem.insertAdjacentHTML('afterbegin', `<span class="awLinks-sidebar-icon">${pageIcon}</span>`);
            }
            const pageColor = pageProps['color'];
            if (pageColor) {
                sidebarLinkItem.style.color = pageColor.replaceAll('"', '');
            }
        }
    }
}

const removeSidebarIcons = () => {
    const pageIcons = doc.querySelectorAll('.nav-contents-container .awLinks-sidebar-icon');
    if (pageIcons.length) {
        for (let i = 0; i < pageIcons.length; i++) {
            pageIcons[i].remove();
        }
    }
}

export const sidebarIconsLoad = async () => {
    if (!globalContext.pluginConfig?.featurePageIconsEnabled) {
        return;
    }
    setSidebarIcons();
}

export const sidebarIconsUnload = () => {
    removeSidebarIcons();
}
