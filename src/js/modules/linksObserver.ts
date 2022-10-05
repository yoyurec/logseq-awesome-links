import { appContainer } from './DOMContainers';
import { setFavicons, setPageIcons, setTitleIcon } from './internal';

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
            // favicons
            const extLinkList = addedNode.querySelectorAll('.external-link') as NodeListOf<HTMLAnchorElement>;
            if (extLinkList.length) {
                setFavicons(extLinkList);
            }
            // page icons
            const linkList = addedNode.querySelectorAll('.ls-block .page-ref:not(.page-property-key)') as NodeListOf<HTMLAnchorElement>;
            if (linkList.length) {
                setPageIcons(linkList);
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
