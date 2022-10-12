import {
    doc,
    searchIcon
} from '../internal';

import './sidebarIcon.css';

export const setSidebarIcons = async (sidebarLinksList?: NodeListOf<HTMLAnchorElement> | HTMLAnchorElement[]) => {
    if (!sidebarLinksList) {
        sidebarLinksList = doc.querySelectorAll('.nav-contents-container :is(.favorite-item , .recent-item) .items-center');
    }
    for (let i = 0; i < sidebarLinksList.length; i++) {
        const sidebarLinkItem = sidebarLinksList[i];
        const defaultIcon = sidebarLinkItem.querySelector('.ui__icon');
        if (!defaultIcon) {
            continue;
        }
        const pageTitle = sidebarLinkItem.querySelector('.page-title')?.textContent;
        if (!pageTitle) {
            continue;
        }
        const pageIcon = await searchIcon(pageTitle);
        if (pageIcon) {
            sidebarLinkItem.insertAdjacentHTML('afterbegin', `<span class="page-icon awLinks-sidebar-icon">${pageIcon}</span>`);
        }
    }
}

const removeSidebarIcons = () => {
    const pageIcons = doc.querySelectorAll('.nav-contents-container .page-icon.awLinks-sidebar-icon');
    if (pageIcons.length) {
        for (let i = 0; i < pageIcons.length; i++) {
            pageIcons[i].remove();
        }
    }
}

export const sidebarIconsLoad = async () => {
    setSidebarIcons();
}

export const sidebarIconsUnload = () => {
    removeSidebarIcons();
}
