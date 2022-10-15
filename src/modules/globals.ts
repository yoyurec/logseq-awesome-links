import { logseq as PL } from '../../package.json';

type globalContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const globalContext: globalContextType = {
    pluginID: PL.id,
    pluginConfig: null,
    pageLinksSelector: '.tag, .page-ref:not(.page-property-key)',
    titleSelector: '.ls-page-title, .journal-title .title',
    tagHasBg: false
};
