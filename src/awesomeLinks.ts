import '@logseq/libs';

import {
    globalContext,
    doc, body, getDOMContainers,
    pageIconsLoad, pageIconsUnload,
    nerdFontLoad, nerdFontUnload,
    faviconsLoad, faviconsUnload,
    journalIconsLoad, journalIconsUnload,
    sidebarIconsLoad, sidebarIconsUnload,
    initLinksObserver, stopLinksObserver, runLinksObserver,
    settingsLoad,
    tabIconsLoad, tabIconsUnload
} from './modules/internal';

const registerPlugin = async () => {
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="css-awesomeLinks" href="lsp://logseq.io/${globalContext.pluginID}/dist/assets/awesomeLinks.css">`)
        }
    }, 500);
}

// Main logic runners
const runStuff = async () => {
    initLinksObserver();
    getDOMContainers();
    setTimeout(() => {
        pageIconsLoad();
        faviconsLoad();
        journalIconsLoad();
        nerdFontLoad();
        body.classList.add('is-awesomeLinks');
    }, 2000)
    setTimeout(() => {
        sidebarIconsLoad();
        tabIconsLoad();
        if (globalContext.pluginConfig?.featureFaviconsEnabled || globalContext.pluginConfig?.featurePageIconsEnabled) {
            runLinksObserver();
        }
    }, 3000)
}
const stopStuff = () => {
    pageIconsUnload();
    faviconsUnload();
    journalIconsUnload();
    sidebarIconsUnload();
    tabIconsUnload();
    nerdFontUnload();
    stopLinksObserver();
    body.classList.remove('is-awesomeLinks');
}

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeIcons: plugin loaded`);

    registerPlugin();
    settingsLoad();

    runStuff();

    setTimeout(() => {
        // Listen plugin unload
        logseq.beforeunload(async () => {
            stopStuff();
        });
    }, 2000)

};

logseq.ready(main).catch(null);
