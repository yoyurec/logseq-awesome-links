
import { faviconsLoad, faviconsUnload } from '../modules/favIcons/favIcons';
import { body, doc, globals } from '../modules/globals';
import { initLinksObserver, runLinksObserver, initTabsObserver, runTabsObserver, stopLinksObserver, stopTabsObserver } from '../modules/linksObserver/linksObserver';
import { iconFontLoad, iconFontUnload } from '../modules/iconFont/iconFont';
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

    if (globals.pluginConfig.featureUpdaterEnabled) {
        setTimeout(() => {
            checkUpdate();
        }, 8000)
    }
}

const registerPlugin = async () => {
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="css-awLi" href="lsp://logseq.io/${globals.pluginID}/dist/assets/awesomeLinks.css">`)
        }
    }, 500);
}

export const runStuff = async () => {
    body.classList.add(globals.isPluginEnabled);
    iconFontLoad();
    setTimeout(() => {
        pageIconsLoad();
        faviconsLoad();
    }, 3000);
    setTimeout(() => {
        if (globals.pluginConfig.faviconsEnabled || globals.pluginConfig.pageIconsEnabled) {
            initLinksObserver();
            runLinksObserver();
        }
        if (globals.pluginConfig.pageIconsEnabled) {
            initTabsObserver();
            runTabsObserver();
        }
    }, 4000);
}

export const stopStuff = () => {
    body.classList.remove(globals.isPluginEnabled);
    pageIconsUnload();
    faviconsUnload();
    iconFontUnload();
    stopLinksObserver();
    stopTabsObserver();
}
