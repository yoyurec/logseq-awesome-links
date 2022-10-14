import {
    doc,
    propsObject,
    searchProps
} from '../internal';

import './titleIcon.css';

export const setTitleIcon = async (pageTitleEl?: HTMLAnchorElement | null) => {
    if (!pageTitleEl) {
        pageTitleEl = doc.querySelector('.ls-page-title h1') as HTMLAnchorElement;
    }
    if (pageTitleEl && !pageTitleEl.querySelector('.page-icon')) {
        const pageName = pageTitleEl.textContent;
        if (pageName) {
            const titleProps = await searchProps(pageName);
            if (titleProps) {
                const titleIcon = titleProps['icon'];
                if (titleIcon) {
                    pageTitleEl.insertAdjacentHTML('afterbegin', `<span class="page-icon awLinks-title-icon">${titleIcon}</span>`);
                }
                const titleColor = titleProps['color'];
                if (titleColor) {
                    pageTitleEl.style.color = titleColor.replaceAll('"', '');
                }
                setTabIcon(titleProps);
            }
        }
    }
}

const setTabIcon = (titleProps: propsObject) => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        const activeTabEL = tabsPluginIframe.contentDocument?.querySelector('.logseq-tab[data-active="true"]');
        if (activeTabEL) {
            const tabIconEL = activeTabEL.querySelector('.text-xs');
            if (tabIconEL) {
                tabIconEL.textContent = titleProps['icon'];
            }
            const tabTitleEL = activeTabEL.querySelector('.logseq-tab-title') as HTMLElement;
            if (tabTitleEL) {
                const titleColor = titleProps['color'];
                if (titleColor) {
                    tabTitleEL.style.color = titleColor.replaceAll('"', '');
                }
            }
        }
    }
}

export const removeTitleIcon = () => {
    doc.querySelector('.awLinks-title-icon')?.remove();
}
