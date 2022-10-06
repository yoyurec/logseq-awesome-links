import '@logseq/libs';
import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import { settingsConfig } from './modules/settings'

import globalContext from './modules/globals';
import { doc, body, getDOMContainers } from './modules/DOMContainers';
import { objectDiff } from './modules/utils';

import { pageIconsLoad, pageIconsUnload, toggleIconsFeature } from './modules/internal';
import { nerdFontLoad, nerdFontUnload, toggleNerdFonFeature } from './modules/internal';
import { faviconsLoad, faviconsUnload, toggleFaviconsFeature } from './modules/internal';
import { journalIconsLoad, journalIconsUnload, toggleJournalIconFeature } from './modules/internal';
import { sidebarIconsLoad, sidebarIconsUnload } from './modules/internal';
import { initLinksObserver, stopLinksObserver, runLinksObserver } from './modules/internal';

import '../css/awesomeLinks.css';

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
        nerdFontLoad();
        faviconsLoad();
        journalIconsLoad();
        sidebarIconsLoad();
        if (globalContext.pluginConfig?.featureFaviconsEnabled || globalContext.pluginConfig?.featurePageIconsEnabled) {
            runLinksObserver();
        }
        body.classList.add('is-awesomeLinks');
    }, 1000)
}
const stopStuff = () => {
    pageIconsUnload();
    nerdFontUnload();
    faviconsUnload();
    journalIconsUnload();
    sidebarIconsUnload();
    stopLinksObserver();
    body.classList.remove('is-awesomeLinks');
}

const runListeners = () => {
    setTimeout(() => {
        // Listen settings update
        logseq.onSettingsChanged((settings, oldSettings) => {
            onSettingsChangedCallback(settings, oldSettings);
        });

        // Listen plugin unload
        logseq.beforeunload(async () => {
            onPluginUnloadCallback();
        });
    }, 2000)
}

// Setting changed
const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globalContext.pluginConfig = { ...settings };
    const settingsDiff = objectDiff({ ...oldSettings }, globalContext.pluginConfig)
    if (settingsDiff.includes('featureFaviconsEnabled')) {
        toggleFaviconsFeature();
    }
    if (settingsDiff.includes('featurePageIconsEnabled')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('featureJournalIcon')) {
        toggleJournalIconFeature();
    }
    if (settingsDiff.includes('featureNerdFontEnabled')) {
        toggleNerdFonFeature();
    }
}

// Plugin unloaded
const onPluginUnloadCallback = () => {
    stopStuff();
}

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeIcons: plugin loaded`);

    globalContext.pluginConfig = logseq.settings;
    registerPlugin();

    runStuff();
    runListeners();

};

logseq.useSettingsSchema(settingsConfig).ready(main).catch(null);
