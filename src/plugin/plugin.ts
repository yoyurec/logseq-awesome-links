
import { faviconsLoad, faviconsUnload } from '../modules/cons/cons';
import { body, doc, globalContext } from '../modules/globals';
import { initLinksObserver, runLinksObserver, initTabsObserver, runTabsObserver, stopLinksObserver, stopTabsObserver } from '../modules/linksObserver/linksObserver';
import { nerdFontLoad, nerdFontUnload } from '../modules/nerdFont/nerdFont';
import { pageIconsLoad, pageIconsUnload } from '../modules/pageIcons/pageIcons';
import { checkUpdate } from '../modules/utils';

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
