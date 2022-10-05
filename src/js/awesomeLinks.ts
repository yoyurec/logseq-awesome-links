import '@logseq/libs';
import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import { settingsConfig } from './modules/settings'

import globalContext from './modules/globals';
import { doc, body, getDOMContainers as setDOMContainers } from './modules/DOMContainers';
import { objectDiff } from './modules/utils';

import { pageIconsLoad, pageIconsUnload, toggleIconsFeature } from './modules/internal';
import { faviconsLoad, faviconsUnload, toggleFaviconsFeature } from './modules/internal';
import { journalIconsLoad, journalIconsUnload, toggleJournalIconFeature } from './modules/internal';
import { stopLinksObserver, runLinksObserver, initLinksObserver } from './modules/internal';

import '../css/awesomeLinks.css';

const registerPlugin = async () => {
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="css-awesomeLinks" href="lsp://logseq.io/${globalContext.pluginID}/dist/assets/awesomeLinks.css">`)
        }
        const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (tabsPluginIframe) {
            tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
                'beforeend',
                `<style>
                    @font-face {
                        font-family: "Fira Code Nerd Font";
                        font-style: normal;
                        font-weight: 400;
                        src: url('lsp://logseq.io/${globalContext.pluginID}/dist/fonts/fira-code-nerd-regular.ttf') format('truetype');
                    }
                    .logseq-tab .text-xs {
                        font-family: "Fira Code Nerd Font";
                    }
                </style>`
            );
        }
    }, 500);
}

// Main logic runners
const runStuff = async () => {
    initLinksObserver();
    setDOMContainers();
    setTimeout(() => {
        pageIconsLoad();
        faviconsLoad();
        journalIconsLoad();
        if (globalContext.pluginConfig?.featureFaviconsEnabled || globalContext.pluginConfig?.featurePageIconsEnabled) {
            runLinksObserver();
        }
        body.classList.add('is-awesomeLinks');
    }, 1000)
}
const stopStuff = () => {
    pageIconsUnload();
    faviconsUnload();
    journalIconsUnload();
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
