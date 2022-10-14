import {
    doc,
    searchProps,
    propsObject
} from '../internal';

export const setTabIcons = async () => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (!tabsPluginIframe) {
        return;
    }
    const tabList = tabsPluginIframe.contentDocument?.querySelectorAll('.logseq-tab:not(.close-all)');
    if (!tabList) {
        return;
    }
    for (let i = 0; i < tabList.length; i++) {
        const tabItem = tabList[i];
        const tabTitle = tabItem.querySelector('.logseq-tab-title')?.textContent?.trim();
        if (!tabTitle) {
            continue;
        }
        const tabProps = await searchProps(tabTitle);
        if (!tabProps) {
            continue;
        }
        setTabItemIcon(tabItem, tabProps);
    }
}

const removeTabIcons = () => {
    //
}

export const tabIconsLoad = async () => {
    setTabIcons();
}

export const tabIconsUnload = () => {
    removeTabIcons();
}

export const setActiveTabIcon = (tabProps: propsObject) => {
    const tabsPluginIframe = doc.getElementById('logseq-tabs_iframe') as HTMLIFrameElement;
    if (!tabsPluginIframe) {
        return;
    }
    const activeTab = tabsPluginIframe.contentDocument?.querySelector('.logseq-tab[data-active="true"]');
    if (!activeTab) {
        return;
    }
    setTabItemIcon(activeTab, tabProps);
}

export const setTabItemIcon = (tabElement: Element, tabProps: propsObject) => {
    const tabIconEL = tabElement.querySelector('.text-xs');
    if (tabIconEL) {
        const titleIcon = tabProps['icon'];
        if (titleIcon && titleIcon !== 'none') {
            tabIconEL.textContent = titleIcon;
        }
    }
    const tabTitleEL = tabElement.querySelector('.logseq-tab-title') as HTMLElement;
    if (tabTitleEL) {
        const titleColor = tabProps['color'];
        if (titleColor && titleColor !== 'none') {
            tabTitleEL.style.color = titleColor.replaceAll('"', '');
        } else {
            tabTitleEL.style.color = '';
        }
    }
}
