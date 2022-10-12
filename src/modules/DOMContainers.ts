export let doc: Document;
export let root: HTMLElement;
export let body: HTMLElement;
export let appContainer: HTMLElement | null;

export const getDOMContainers = async () => {
    doc = parent.document;
    root = doc.documentElement;
    body = doc.body;
    appContainer = doc.getElementById('app-container');
}
