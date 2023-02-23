import { body, doc, globalContext } from '../globals';

import nerdFontsStyles from './nerdFont.css?inline';

let tabsPluginIframe: HTMLIFrameElement;

export const toggleNerdFonFeature = () => {
    if (globalContext.pluginConfig.nerdFontEnabled) {
        nerdFontLoad();
    } else {
        nerdFontUnload();
    }
}

export const nerdFontLoad = async () => {
    if (!globalContext.pluginConfig.nerdFontEnabled) {
        return;
    }
    tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    setTimeout(() => {
        doc.head.insertAdjacentHTML(
            'beforeend',
            `<style id="awLi-nerd-font-css">
                @font-face {
                    font-family: "NerdFont";
                    font-style: normal;
                    font-weight: 400;
                    src: url('lsp://logseq.io/${globalContext.pluginID}/dist/fonts/nerd-regular.ttf') format('truetype');
                }
            </style>`
        );
        if (tabsPluginIframe) {
            tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
                'beforeend',
                `<style id="awLi-nerd-font-css">
                    @font-face {
                        font-family: "NerdFont";
                        font-style: normal;
                        font-weight: 400;
                        src: url('lsp://logseq.io/${globalContext.pluginID}/dist/fonts/nerd-regular.ttf') format('truetype');
                    }
                </style>`
            );
        }
        logseq.provideStyle({ key: 'awLi-nerd-font-css', style: nerdFontsStyles });
        body.classList.add('awLi-nerd');
    }, 1000)
}

export const nerdFontUnload = () => {
    if (tabsPluginIframe) {
        tabsPluginIframe.contentDocument?.getElementById('awLi-nerd-font-css')?.remove();
    }
    doc.head.querySelector(`style[data-injected-style="awLi-nerd-font-css-${globalContext.pluginID}"]`)?.remove();
    body.classList.remove('awLi-nerd');
}
