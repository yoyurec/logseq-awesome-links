import globalContext from './globals';
import { doc } from './DOMContainers';

import nerdFontsStyles from '../../css/nerdFont.css?inline';

export const toggleNerdFonFeature = () => {
    if (globalContext.pluginConfig?.featureNerdFontEnabled) {
        nerdFontLoad();
    } else {
        nerdFontUnload();
    }
}

export const nerdFontLoad = () => {
    if (!globalContext.pluginConfig?.featureNerdFontEnabled) {
        return;
    }
    setTimeout(() => {
        const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
        if (tabsPluginIframe) {
            tabsPluginIframe.contentDocument?.head.insertAdjacentHTML(
                'beforeend',
                `<style id="awesomeLinks">
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
        logseq.provideStyle({ key: 'awLi-nerd-font-css', style: nerdFontsStyles });
    }, 1000)
}

export const nerdFontUnload = () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        tabsPluginIframe.contentDocument?.getElementById('awesomeLinks')?.remove();
    }
    doc.head.querySelector(`style[data-injected-style="awLi-nerd-font-css-${globalContext.pluginID}"]`)?.remove();
}
