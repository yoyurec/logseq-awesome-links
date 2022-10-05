import { doc } from './DOMContainers';
import { getInheritedPropsIcon } from './queries';

export const setTitleIcon = async (pageTitleEl?: Element | null) => {
    if (!pageTitleEl) {
        pageTitleEl = doc.querySelector('.ls-page-title');
    }
    if (pageTitleEl && !pageTitleEl.querySelector('.page-icon')) {
        const pageName = pageTitleEl.textContent;
        if (pageName) {
            const titleIcon = await getInheritedPropsIcon(pageName);
            if (titleIcon) {
                pageTitleEl.insertAdjacentHTML('afterbegin', `<span class="page-icon awLinks-title-icon">${titleIcon}</span>`);
                setTabIcon(titleIcon);
            }
        }
    }
}

const setTabIcon = (titleIcon: string) => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (tabsPluginIframe) {
        const tabIconEL = tabsPluginIframe.contentDocument?.querySelector('.logseq-tab[data-active="true"] .text-xs');
        if (tabIconEL) {
            tabIconEL.textContent = titleIcon;
        }
    }
}

export const removeTitleIcon = () => {
    doc.querySelector('.awLinks-title-icon')?.remove();
}