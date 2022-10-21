import {
    globalContext,
    doc, body,
    tabsPluginIframe
} from '../internal';

import nerdFontsStyles from './nerdFont.css?inline';

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
    setTimeout(() => {
        if (tabsPluginIframe) {
            tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
                'beforeend',
                `<style id="awLi-nerd-font-css">
                    @font-face {
                        font-family: "Fira Code Nerd Font";
                        font-style: normal;
                        font-weight: 400;
                        src: url('lsp://logseq.io/${globalContext.pluginID}/dist/fonts/fira-code-nerd-regular.ttf') format('truetype');
                    }
                    .logseq-tab .awLi-tab-icon {
                        font-family: "Fira Code Nerd Font";
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
