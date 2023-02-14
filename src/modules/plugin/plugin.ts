import {
    globalContext,
    getDOMContainers,
    doc, body,
    pageIconsLoad, pageIconsUnload,
    nerdFontLoad, nerdFontUnload,
    faviconsLoad, faviconsUnload,
    initLinksObserver, stopLinksObserver, runLinksObserver,
    initTabsObserver, runTabsObserver, stopTabsObserver,
} from '../internal';
import { checkUpdate } from '../utils';

export const pluginLoad = () => {
    registerPlugin();

    runStuff();

    setTimeout(() => {
        // Listen plugin unload
        logseq.beforeunload(async () => {
            stopStuff();
        });
    }, 2000)

    if (globalContext.pluginConfig.featureUpdaterEnabled) {
        setTimeout(() => {
            checkUpdate();
        }, 8000)
    }
}


const registerPlugin = async () => {
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="css-awLi" href="lsp://logseq.io/${globalContext.pluginID}/dist/assets/awesomeLinks.css">`)
        }
    }, 500);
}

export const runStuff = async () => {
    getDOMContainers();
    body.classList.add(globalContext.isPluginEnabled);
    nerdFontLoad();
    setTimeout(() => {
        pageIconsLoad();
        faviconsLoad();
    }, 3000);
    setTimeout(() => {
        if (globalContext.pluginConfig.faviconsEnabled || globalContext.pluginConfig.pageIconsEnabled) {
            initLinksObserver();
            runLinksObserver();
        }
        if (globalContext.pluginConfig.pageIconsEnabled) {
            initTabsObserver();
            runTabsObserver();
        }
    }, 4000);
}

export const stopStuff = () => {
    body.classList.remove(globalContext.isPluginEnabled);
    pageIconsUnload();
    faviconsUnload();
    nerdFontUnload();
    stopLinksObserver();
    stopTabsObserver();
}
