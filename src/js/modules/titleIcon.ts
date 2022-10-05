import { doc } from './DOMContainers';
import { getInheritedPropsIcon } from './queries';

export const setTitleIcon = async (pageNameEl?: Element) => {
    const title = pageNameEl || doc.querySelector('.ls-page-title');
    if (title && !title.querySelector('.page-icon')) {
        const pageName = title.textContent;
        if (pageName) {
            const titleIcon = await getInheritedPropsIcon(pageName);
            if (titleIcon) {
                title.insertAdjacentHTML('afterbegin', `<span class="page-icon awLinks-title-icon">${titleIcon}</span>`);
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
