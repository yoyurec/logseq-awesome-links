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
            // favicons
            const extLink = addedNode.querySelector('.external-link') as HTMLAnchorElement;
            if (extLink) {
                setFavicons([extLink]);
            }
            // page icons
            const pageLink = addedNode.querySelector('.ls-block .page-ref:not(.page-property-key)') as HTMLAnchorElement;
            if (pageLink) {
                setPageIcons([pageLink]);
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
