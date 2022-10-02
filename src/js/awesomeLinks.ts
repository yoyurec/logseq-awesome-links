import '@logseq/libs';
import { SettingSchemaDesc, LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';
import { logseq as PL } from '../../package.json';

import tabsPluginStyles from '../css/tabsPlugin.css';

const pluginID = PL.id;

let doc: Document;
let root: HTMLElement;
let body: HTMLElement;
let appContainer: HTMLElement | null;

let oldPluginConfig: LSPluginBaseInfo['settings'];
let pluginConfig: LSPluginBaseInfo['settings'];

const settingSchema: SettingSchemaDesc[] = [
    {
        key: 'promoSolext',
        title: '',
        description: '⚡ Also try "Solarized Extended" theme with lots of UI changes and more features! ⚡ https://github.com/yoyurec/logseq-solarized-extended-theme',
        type: 'boolean',
        default: false,
    },
    {
        key: 'featureFaviconsEnabled',
        title: '',
        description: 'Show site favicon for external links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featurePageIconsEnabled',
        title: '',
        description: 'Show page icon for internal links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureInheritPageIcons',
        title: '',
        description: 'Inherit page icon from custom property page',
        type: 'string',
        default: 'page-type',
    },
    {
        key: 'featureJournalIcon',
        title: '',
        description: 'Journal item icon: emoji or Nerd icon (https://www.nerdfonts.com/cheat-sheet). Delete value to disable feature',
        type: 'string',
        default: '',
    }
];

const toggleFaviconsFeature = () => {
    if (pluginConfig.featureFaviconsEnabled) {
        faviconsLoad();
    } else {
        faviconsDisable();
    }
}
const toggleIconsFeature = () => {
    if (pluginConfig.featurePageIconsEnabled) {
        pageIconsLoad();
    } else {
        pageIconsDisable();
    }
}
const toggleJournalIconFeature = () => {
    if (pluginConfig.featureJournalIcon) {
        journalIconsLoad();
    } else {
        journalIconsUnload();
    }
}

// External links favicons
const setFavicons = (extLinkList: NodeListOf<HTMLAnchorElement>) => {
    for (let i = 0; i < extLinkList.length; i++) {
        const oldFav = extLinkList[i].querySelector('.external-link-img');
        if (oldFav) {
            oldFav.remove();
        }
        const { hostname, protocol } = new URL(extLinkList[i].href);
        if ((protocol === 'http:') || (protocol === 'https:')) {
            const faviconValue = `https://www.google.com/s2/favicons?domain=${hostname}&sz=16`;
            const fav = doc.createElement('img');
            fav.src = faviconValue;
            fav.width = 16;
            fav.height = 16;
            fav.classList.add('external-link-img');
            extLinkList[i].insertAdjacentElement('afterbegin', fav);
        }
    }
    body.classList.add('is-awesomeLinks-ext');
}
const removeFavicons = () => {
    const favicons = doc.querySelectorAll('.external-link-img');
    if (favicons.length) {
        for (let i = 0; i < favicons.length; i++) {
            favicons[i].remove();
        }
    }
    body.classList.remove('is-awesomeLinks-ext');
}


const getPageIcon = async (title: string) => {
    let pageIcon = '';
    title = title.toLowerCase();
    const iconQuery = `
    [
      :find ?icon
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?prop]
          [(get ?prop :icon) ?icon]
    ]
    `;
    const journalQuery = `
    [
      :find ?isjournal
      :where
          [?id :block/name "${title}"]
          [?id :block/journal? ?isjournal]
    ]
    `;
    const isJournal = await logseq.DB.datascriptQuery(journalQuery);
    if (isJournal.length && isJournal[0][0] && pluginConfig.featureJournalIcon) {
        return pluginConfig.featureJournalIcon;
    }
    const pageIconArr = await logseq.DB.datascriptQuery(iconQuery);
    if (pageIconArr.length) {
        pageIcon = pageIconArr[0];
    }
    return pageIcon;
}

const getInheritedPropsTitle = async (title: string, prop: string) => {
    title = title.toLowerCase();
    let inheritedPageTitle = '';
    const inheritedTitleQuery = `
    [
      :find ?title
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?prop]
          [(get ?prop :${prop}) ?title]
    ]
    `;
    const titleArr = await logseq.DB.datascriptQuery(inheritedTitleQuery);
    if (titleArr.length) {
        inheritedPageTitle = titleArr[0][0][0];
    }
    return inheritedPageTitle;
}

const getAliasedPageTitle = async (title: string) => {
    title = title.toLowerCase();
    let aliasedPageTitle = '';
    const inheritedAliasQuery = `
    [
        :find ?origtitle
        :where
            [?id :block/name "${title}"]
            [?origid :block/alias ?id]
            [?origid :block/name ?origtitle]
    ]
    `;
    const aliasArr = await logseq.DB.datascriptQuery(inheritedAliasQuery);
    if (aliasArr.length) {
        aliasedPageTitle = aliasArr[0][0];
    }
    return aliasedPageTitle;
}

const setPageIcons = async (linkList: NodeListOf<HTMLAnchorElement>) => {
    for (let i = 0; i < linkList.length; i++) {
        const linkItem = linkList[i];
        const oldPageIcon = linkItem.querySelector('.link-icon');
        if (oldPageIcon) {
            oldPageIcon.remove();
        }
        let pageTitle = linkItem.getAttribute('data-ref');
        if (!pageTitle) {
            continue;
        }
        // get from page
        let pageIcon = await getPageIcon(pageTitle);
        if (!pageIcon) {
            // get from aliased page
            const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
            if (aliasedPageTitle) {
                pageIcon = await getPageIcon(aliasedPageTitle);
            }
        }

        if (!pageIcon && pluginConfig.featureInheritPageIcons) {
            if (!pageIcon) {
                // inherited from page props, when props linked to page
                const inheritedPropsTitle = await getInheritedPropsTitle(pageTitle, pluginConfig.featureInheritPageIcons);
                if (inheritedPropsTitle) {
                    pageIcon = await getPageIcon(inheritedPropsTitle);
                    // if (!pageIcon) {
                    //     // inherited from page props, when props linked to aliased
                    //     const aliasedPageTitle = await getAliasedPageTitle(inheritedPropsTitle);
                    //     if (aliasedPageTitle) {
                    //         pageIcon = await getPageIcon(aliasedPageTitle);
                    //     }
                    // }
                }
            }
            if (!pageIcon) {
                // inherited from aliased page props, when props linked to page
                const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
                if (aliasedPageTitle) {
                    const inheritedPageTitle = await getInheritedPropsTitle(aliasedPageTitle, pluginConfig.featureInheritPageIcons);
                    if (inheritedPageTitle) {
                        pageIcon = await getPageIcon(inheritedPageTitle);
                    }
                }
            }
        }
        if (pageIcon) {
            linkItem.insertAdjacentHTML('afterbegin', `<span class="link-icon">${pageIcon}</span>`);
        }
    }
    body.classList.add('is-awesomeLinks-int');
}
const removePageIcons = () => {
    const pageIcons = doc.querySelectorAll('.link-icon');
    if (pageIcons.length) {
        for (let i = 0; i < pageIcons.length; i++) {
            pageIcons[i].remove();
        }
    }
    body.classList.remove('is-awesomeLinks-int');
}

// const setTitleInheritedIcons = async (titleList: NodeListOf<HTMLAnchorElement>) => {
//     for (let i = 0; i < titleList.length; i++) {
//         let iconExists = false;
//         const titleItem = titleList[i];
//         const originalIcon = titleItem.querySelector('.page-icon');
//         if (originalIcon) {
//             iconExists = !!originalIcon.textContent;
//         }
//         if (iconExists || !pluginConfig.featureInheritPageIcons) {
//             continue;
//         }
//         let pageIcon = '';
//         const pageTitle = titleItem.textContent;
//         if (!pageTitle) {
//             continue;
//         }
//         const inheritedTitle = await getInheritedPageTitle(pageTitle.toLowerCase(), pluginConfig.featureInheritPageIcons);
//         if (inheritedTitle) {
//             pageIcon = await getPageIcon(inheritedTitle.toLowerCase());
//             if (pageIcon) {
//                 originalIcon?.remove();
//                 titleItem.insertAdjacentHTML('afterbegin', `<span class="link-icon">${pageIcon}</span>`);
//             }
//         }
//     }
// }

const faviconsLoad = () => {
    if (pluginConfig.featureFaviconsEnabled) {
        setTimeout(() => {
            const extLinkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.external-link');
            setFavicons(extLinkList);
        }, 500);
    }
}
const faviconsDisable = () => {
    removeFavicons();
    if (!pluginConfig.featurePageIconsEnabled && !pluginConfig.featureFaviconsEnabled) {
        stopLinksObserver();
    }
}
const faviconsUnload = () => {
    removeFavicons();
}

const pageIconsLoad = () => {
    const linkList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.ls-block .page-ref:not(.page-property-key)');
    setPageIcons(linkList);
    // const pageTitleList: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('h1.title, .favorite-item a, .recent-item a');
    // setTitleInheritedIcons(pageTitleList);
}
const pageIconsDisable = () => {
    removePageIcons();
    if (!pluginConfig.featurePageIconsEnabled && !pluginConfig.featureFaviconsEnabled) {
        stopLinksObserver();
    }
}
const pageIconsUnload = () => {
    removePageIcons();
}

const journalIconsLoad = () => {
    if (!pluginConfig.featureJournalIcon) {
        return;
    }
    root.style.setProperty('--awesomeLinks-journal-icon', `"${pluginConfig.featureJournalIcon}"`);
    body.classList.add('is-awesomeLinks-journal');
}
const journalIconsUnload = () => {
    root.style.removeProperty('--awesomeLinks-journal-icon');
    body.classList.remove('is-awesomeLinks-journal');
}

// Links observer
let linksObserver: MutationObserver, linksObserverConfig: MutationObserverInit;
const linksObserverCallback: MutationCallback = function (mutationsList) {
    if (!appContainer) {
        return;
    }
    for (let i = 0; i < mutationsList.length; i++) {
        const addedNode = mutationsList[i].addedNodes[0] as HTMLAnchorElement;
        if (addedNode && addedNode.childNodes.length) {
            // favicons
            const extLinkList = addedNode.querySelectorAll('.external-link') as NodeListOf<HTMLAnchorElement>;
            if (extLinkList.length) {
                stopLinksObserver();
                setFavicons(extLinkList);
                runLinksObserver();
            }
            // page icons
            const linkList = addedNode.querySelectorAll('.ls-block .page-ref:not(.page-property-key)') as NodeListOf<HTMLAnchorElement>;
            if (linkList.length) {
                stopLinksObserver();
                setPageIcons(linkList);
                runLinksObserver();
            }
            // page title
            // const pageTileList = addedNode.querySelectorAll('h1.title, .favorite-item a, .recent-item a') as NodeListOf<HTMLAnchorElement>;
            // if (pageTileList.length) {
            //     stopLinksObserver();
            //     setTitleInheritedIcons(pageTileList);
            //     runLinksObserver();
            // }
        }
    }
};
const initLinksObserver = () => {
    linksObserverConfig = { childList: true, subtree: true };
    linksObserver = new MutationObserver(linksObserverCallback);
}
const runLinksObserver = () => {
    if (!appContainer) {
        return;
    }
    linksObserver.observe(appContainer, linksObserverConfig);
}
const stopLinksObserver = () => {
    linksObserver.disconnect();
}



// Main logic runners
const runStuff = () => {
    setTimeout(() => {
        journalIconsLoad();
        faviconsLoad();
        pageIconsLoad();
        if (pluginConfig.featureFaviconsEnabled || pluginConfig.featurePageIconsEnabled) {
            runLinksObserver();
        }
        body.classList.add('is-awesomeLinks');
    }, 1000)
}
const stopStuff = () => {
    unregisterPlugin()
    pageIconsUnload();
    faviconsUnload();
    journalIconsUnload();
    stopLinksObserver();
    body.classList.remove('is-awesomeLinks');
}

// Setting changed
const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    oldPluginConfig = { ...oldSettings };
    pluginConfig = { ...settings };
    const settingsDiff = objectDiff(oldPluginConfig, pluginConfig)
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

// Utils: object diff
const objectDiff = (orig: object, updated: object) => {
    const difference = Object.keys(orig).filter((key) => {
        if (key === 'presetCustom') {
            return false
        }
        // @ts-ignore
        return orig[key] !== updated[key]
    });
    return difference;
}

// Plugin unloaded
const onPluginUnloadCallback = () => {
    stopStuff();
}

const registerPlugin = async () => {
    setTimeout(() => {
        if (doc.head) {
            doc.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" id="css-awesomeLinks" href="lsp://logseq.io/${pluginID}/dist/assets/css/awesomeLinks.css">`)
        }
        const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (tabsPluginIframe) {
            tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
                'beforeend',
                `<style>
                    ${tabsPluginStyles}
                </style>`
            );
        }
    }, 500);
}

const unregisterPlugin = () => {
    doc.getElementById('css-awesomeLinks')?.remove();
}

// Get main containers
const getDOMContainers = async () => {
    doc = parent.document;
    root = doc.documentElement;
    body = doc.body;
    appContainer = doc.getElementById('app-container');
}

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeIcons: plugin loaded`);

    logseq.useSettingsSchema(settingSchema);

    getDOMContainers();
    pluginConfig = logseq.settings as LSPluginBaseInfo['settings'];

    registerPlugin();

    initLinksObserver();

    // First thme run
    runStuff();

    // Later listeners
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

};

logseq.ready(main).catch(console.error);
