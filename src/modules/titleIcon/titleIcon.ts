import {
    doc,
    searchProps,
    setActiveTabIcon
} from '../internal';

import './titleIcon.css';

export const setTitleIcon = async (pageTitleEl?: HTMLAnchorElement | null) => {
    if (!pageTitleEl) {
        pageTitleEl = doc.querySelector('.ls-page-title h1') as HTMLAnchorElement;
    }
    if (pageTitleEl) {
        const pageName = pageTitleEl.childNodes[pageTitleEl.childNodes.length - 1].textContent;
        if (pageName) {
            const titleProps = await searchProps(pageName);
            if (titleProps) {
                const titleIcon = titleProps['icon'];
                if (titleIcon && titleIcon !== 'none' && !pageTitleEl.querySelector('.page-icon')) {
                    pageTitleEl.insertAdjacentHTML('afterbegin', `<span class="awLinks-title-icon">${titleIcon}</span>`);
                }
                const titleColor = titleProps['color'];
                if (titleColor && titleColor !== 'none') {
                    pageTitleEl.style.color = titleColor.replaceAll('"', '');
                }
                setActiveTabIcon(titleProps);
            }
        }
    }
}

export const removeTitleIcon = () => {
    doc.querySelector('.awLinks-title-icon')?.remove();
}
