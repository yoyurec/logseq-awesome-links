import '@logseq/libs';

import {
    globalContext,
    getDOMContainers,
    doc, body,
    pageIconsLoad, pageIconsUnload,
    nerdFontLoad, nerdFontUnload,
    faviconsLoad, faviconsUnload,
    initLinksObserver, stopLinksObserver, runLinksObserver,
    settingsLoad,
    initTabsObserver, runTabsObserver, stopTabsObserver,
} from './modules/internal';
import { checkUpdate } from './modules/utils';

const registerPlugin = async () => {
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="css-awLi" href="lsp://logseq.io/${globalContext.pluginID}/dist/assets/awesomeLinks.css">`)
        }
    }, 500);
}

// Main logic runners
const runStuff = async () => {
    getDOMContainers();
    body.classList.add(globalContext.isPluginEnabled);
    nerdFontLoad();
    setTimeout(() => {
        pageIconsLoad();
        faviconsLoad();
    }, 2000);
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
const stopStuff = () => {
    body.classList.remove(globalContext.isPluginEnabled);
    pageIconsUnload();
    faviconsUnload();
    nerdFontUnload();
    stopLinksObserver();
    stopTabsObserver();
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

    setTimeout(() => {
        checkUpdate();
    }, 8000)
};

logseq.ready(main).catch(null);
