import { doc, body, globals } from '../globals';

import iconFontsStyles from './iconFont.css?inline';


let tabsPluginIframe: HTMLIFrameElement;


export const iconFontLoad = () => {
    logseq.provideStyle({ key: 'awLi-icon-font-css', style: iconFontsStyles });
    toggleIconFontFeature();
}

export const iconFontUnload = () => {
    doc.head.querySelector(`style[data-injected-style="awLi-icon-font-css-${globals.pluginID}"]`)?.remove();
}

export const toggleIconFontFeature = () => {
    switch (globals.pluginConfig.iconFont) {
        case 'nerd':
            nerdFontLoad();
            body.dataset.awliIconFont = 'nerd';
            break;
        case 'tabler-icons':
            tablerFontLoad();
            body.dataset.awliIconFont = 'tabler-icons';
            break;
        case 'None':
            delete body.dataset.awliIconFont;
            iconFontUnload();
            break;
    }
}

const nerdFontLoad = async () => {
    setTimeout(() => {
        doc.head.insertAdjacentHTML(
            'beforeend',
            `<style id="awLi-nerd-font-css">
                @font-face {
                    font-family: "nerd";
                    font-style: normal;
                    font-weight: 400;
                    src: url('lsp://logseq.io/${globals.pluginID}/dist/fonts/nerd.ttf?v=2') format('truetype');
                }
            </style>`
        );
        tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (tabsPluginIframe) {
            tabsPluginIframe.contentDocument?.getElementById('awLi-nerd-font-css')?.remove();
            tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
                'beforeend',
                `<style id="awLi-nerd-font-css">
                    @font-face {
                        font-family: "nerd";
                        font-style: normal;
                        font-weight: 400;
                        src: url('lsp://logseq.io/${globals.pluginID}/dist/fonts/nerd.ttf?v=2') format('truetype');
                    }
                    .awLi-icon {
                        font-family: "nerd";
                    }
                </style>`
            );
        }
    }, 1000);
}

// eslint-disable-next-line
const nerdFontUnload = () => {}

const tablerFontLoad = () => {
    tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        tabsPluginIframe.contentDocument?.getElementById('awLi-tabler-font-css')?.remove();
        tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
            'beforeend',
            `<style id="awLi-tabler-font-css">
                @font-face {
                    font-family: "tabler-icons";
                    font-style: normal;
                    font-weight: 400;
                    src: url('lsp://logseq.io/${globals.pluginID}/dist/fonts/tabler-icons.woff2') format('woff2');
                }
                .awLi-icon {
                    font-family: "tabler-icons";
                }
            </style>`
        );
    }
}

// eslint-disable-next-line
const tablerFontUnload = () => {}
