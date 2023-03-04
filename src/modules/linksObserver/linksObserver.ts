import { setFavicons } from '../favIcons/favIcons';
import { globals, doc } from '../globals';
import { setPageIcons, processLinkItem } from '../pageIcons/pageIcons';

let linksObserver: MutationObserver;
let linksObserverConfig: MutationObserverInit;

export const initLinksObserver = () => {
    linksObserverConfig = {
        childList: true,
        subtree: true
    };
    linksObserver = new MutationObserver(linksObserverCallback);
}

const linksObserverCallback: MutationCallback = function (mutationsList) {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        if (addedNode && addedNode.childNodes.length) {
            // page icons
            if (globals.pluginConfig.pageIconsEnabled) {
                setPageIcons(addedNode);
            }
            // favicons
            if (globals.pluginConfig.faviconsEnabled) {
                const extLinkList = [... addedNode.querySelectorAll(globals.extLinksSelector)] as HTMLElement[];
                if (extLinkList.length) {
                    setFavicons(extLinkList);
                }
            }
        }
    }
};

export const runLinksObserver = () => {
    const appContainer = doc.getElementById('app-container');
    if (!appContainer) {
        return;
    }
    linksObserver.observe(appContainer, linksObserverConfig);
}

export const stopLinksObserver = () => {
    linksObserver.disconnect();
}

// Tabs

let tabsObserver: MutationObserver;
let tabsObserverConfig: MutationObserverInit;

export const initTabsObserver = () => {
    tabsObserverConfig = {
        childList: true,
        subtree: true
    };
    tabsObserver = new MutationObserver(tabsObserverCallback);
}

const tabsObserverCallback: MutationCallback = function (mutationsList) {
    for (let i = 0; i < mutationsList.length; i++) {
        const mutationItem = mutationsList[i];
        const addedNode = mutationItem.addedNodes[0] as HTMLElement;
        if (addedNode && addedNode.childNodes.length) {
            const tabLink = addedNode.querySelector('.logseq-tab-title') as HTMLElement;
            if (tabLink) {
                processLinkItem(tabLink);
            }
        }
    }
};

export const runTabsObserver = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        const tabsContainer = tabsPluginIframe.contentDocument?.querySelector('.logseq-tab-wrapper');
        if (tabsContainer) {
            tabsObserver.observe(tabsContainer, tabsObserverConfig);
        }
    }
}

export const stopTabsObserver = () => {
    tabsObserver.disconnect();
}