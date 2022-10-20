export let doc: Document;
export let root: HTMLElement;
export let body: HTMLElement;
export let appContainer: HTMLElement | null;
export let tabsPluginIframe: HTMLIFrameElement;

export const getDOMContainers = () => {
    doc = parent.document;
    root = doc.documentElement;
    body = doc.body;
    appContainer = doc.getElementById('app-container');
    tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
}
