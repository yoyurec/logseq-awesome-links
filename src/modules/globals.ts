import { logseq as PL } from '../../package.json';

type globalContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface propsObject {
    icon?: string;
    iconFont?: string;
    color?: string;
    hidetitle?: boolean;
    hidetitletext?: string;
    needStroke?: boolean;
}

export const doc = parent.document;
export const root = doc.documentElement;
export const body = doc.body;

export const globals: globalContextType = {
    pluginID: PL.id,
    pluginConfig: null,
    isPluginEnabled: 'is-awLi-enabled',
    extLinksSelector: '.external-link',
    pageLinksSelector: '.page-ref:not(.page-property-key), .tag, .references li a',
    titleSelector: '.page-title, .journal-title .title',
    sidebarLinkSelector: '.nav-contents-container .page-title',
    tabLinkSelector: '.logseq-tab:not(.close-all) .logseq-tab-title',
    tagHasBg: false,
    themeColor: '',
    themeBg: '',
    favIconsCache: Object.create(null),
    defaultPageProps: Object.create(null),
    defaultJournalProps: Object.create(null),
};

