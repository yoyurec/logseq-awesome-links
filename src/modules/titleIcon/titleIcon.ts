import {
    doc,
    globalContext,
    searchProps,
    setActiveTabIcon
} from '../internal';

import './titleIcon.css';

export const setTitleIcon = async (titleList?: NodeListOf<HTMLAnchorElement> | null) => {
    if (!titleList) {
        titleList = doc.querySelectorAll(globalContext.titleSelector) as NodeListOf<HTMLAnchorElement>;
    }
    for (let i = 0; i < titleList.length; i++) {
        const titleItem = titleList[i];
        const origIcon = titleItem.querySelector('.page-icon');
        if (origIcon) {
            origIcon.remove();
        }
        const pageName = titleItem.childNodes[titleItem.childNodes.length - 1].textContent;
        if (pageName) {
            const titleProps = await searchProps(pageName);
            if (titleProps) {
                const titleIcon = titleProps['icon'];
                if (titleIcon && titleIcon !== 'none') {
                    titleItem.insertAdjacentHTML('afterbegin', `<span class="awLinks-title-icon">${titleIcon}</span>`);
                }
                const titleColor = titleProps['color'];
                if (titleColor && titleColor !== 'none') {
                    titleItem.style.color = titleColor.replaceAll('"', '');
                }
                setActiveTabIcon(titleProps);
            }
        }
    }
}

export const removeTitleIcon = () => {
    doc.querySelector('.awLinks-title-icon')?.remove();
}
