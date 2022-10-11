import globalContext from './globals';
import { appContainer } from './DOMContainers';
import { setFavicons, setPageIcons, setSidebarIcons, setTitleIcon } from './internal';

let linksObserver: MutationObserver, linksObserverConfig: MutationObserverInit;

export const initLinksObserver = () => {
    linksObserverConfig = { childList: true, subtree: true };
    linksObserver = new MutationObserver(linksObserverCallback);
}

const linksObserverCallback: MutationCallback = function (mutationsList) {
    if (!appContainer) {
        return;
    }
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLAnchorElement;
        if (addedNode && addedNode.childNodes.length) {
            // favicons
            if (globalContext.pluginConfig?.featureFaviconsEnabled) {
                const extLinkList = addedNode.querySelectorAll('.external-link') as NodeListOf<HTMLAnchorElement>;
                if (extLinkList.length) {
                    setFavicons(extLinkList);
                }
            }
            if (globalContext.pluginConfig?.featurePageIconsEnabled) {
                // title icon
                const titleEl = addedNode.querySelector('.ls-page-title');
                if (titleEl) {
                    setTitleIcon(titleEl);
                }
                // sidebar icon
                if (addedNode.classList.contains('favorite-item') || addedNode.classList.contains('recent-item')) {
                    const sidebarLink = addedNode.querySelector('a') as HTMLAnchorElement;
                    if (sidebarLink) {
                        setSidebarIcons([sidebarLink]);
                    }
                }
                // page icons
                const pageLinkList = addedNode.querySelectorAll('.ls-block .page-ref:not(.page-property-key)') as NodeListOf<HTMLAnchorElement>;
                if (pageLinkList.length) {
                    setPageIcons(pageLinkList);
                }
            }
        }
    }
};

export const runLinksObserver = () => {
    if (!appContainer) {
        return;
    }
    linksObserver.observe(appContainer, linksObserverConfig);
}

export const stopLinksObserver = () => {
    linksObserver.disconnect();
}
