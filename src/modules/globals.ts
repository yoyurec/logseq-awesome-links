import { logseq as PL } from '../../package.json';

type globalContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const globalContext: globalContextType = {
    pluginID: PL.id,
    pluginConfig: null,
    isPluginEnabled: 'is-awLi-enabled',
    extLinksSelector: '.external-link',
    pageLinksSelector: '.page-ref:not(.page-property-key), .tag, .references li a',
    titleSelector: '.page-title, .journal-title .title',
    sidebarLinkSelector: '.nav-contents-container .page-title',
    tabLinkSelector: '.logseq-tab:not(.close-all) .logseq-tab-title',
    tagHasBg: false,
    themeBg: '',
    favIconsCache: Object.create(null),
    doc: parent.document,
    root: parent.document.documentElement,
    body: parent.document.body,
    appContainer: parent.document.getElementById('app-container'),
    tabsPluginIframe: parent.document.getElementById('logseq-tabs_iframe')
};

