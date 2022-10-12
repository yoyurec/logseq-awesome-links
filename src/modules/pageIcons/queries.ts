import '@logseq/libs';
import { globalContext } from '../internal';

export const getPageIcon = async (title: string) => {
    let pageIcon = '';
    title = title.toLowerCase();
    const iconQuery = `
    [
      :find ?icon
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?prop]
          [(get ?prop :icon) ?icon]
    ]
    `;
    const journalQuery = `
    [
      :find ?isjournal
      :where
          [?id :block/name "${title}"]
          [?id :block/journal? ?isjournal]
    ]
    `;
    const isJournal = await logseq.DB.datascriptQuery(journalQuery);
    if (isJournal.length && isJournal[0][0] && globalContext.pluginConfig?.featureJournalIcon) {
        return globalContext.pluginConfig?.featureJournalIcon;
    }
    const pageIconArr = await logseq.DB.datascriptQuery(iconQuery);
    if (pageIconArr.length) {
        pageIcon = pageIconArr[0];
    }
    return pageIcon;
}

export const getInheritedPropsTitle = async (title: string, prop: string) => {
    title = title.toLowerCase();
    let inheritedPageTitle = '';
    const inheritedTitleQuery = `
    [
      :find ?title
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?prop]
          [(get ?prop :${prop}) ?title]
    ]
    `;
    const titleArr = await logseq.DB.datascriptQuery(inheritedTitleQuery);
    if (titleArr.length) {
        inheritedPageTitle = titleArr[0][0][0];
    }
    return inheritedPageTitle;
}

export const getAliasedPageTitle = async (title: string) => {
    title = title.toLowerCase();
    let aliasedPageTitle = '';
    const inheritedAliasQuery = `
    [
        :find ?origtitle
        :where
            [?id :block/name "${title}"]
            [?origid :block/alias ?id]
            [?origid :block/name ?origtitle]
    ]
    `;
    const aliasArr = await logseq.DB.datascriptQuery(inheritedAliasQuery);
    if (aliasArr.length) {
        aliasedPageTitle = aliasArr[0][0];
    }
    return aliasedPageTitle;
}

export const searchIcon = async (pageTitle: string): Promise<string> => {
    // get from page
    let pageIcon = await getPageIcon(pageTitle);
    if (!pageIcon) {
        // get from aliased page
        pageIcon = await getAliasedPageIcon(pageTitle);
        if (!pageIcon && globalContext.pluginConfig?.featureInheritPageIcons) {
            // inherited from page props, when props linked to page
            pageIcon = await getInheritedPropsIcon(pageTitle);
            if (!pageIcon) {
                // inherited from aliased page props, when props linked to page
                pageIcon = getAliasedPropsIcon(pageTitle);
            }
            // if (!pageIcon) {
            //     // inherited from page props, when props linked to aliased
            //     const aliasedPageTitle = await getAliasedPageTitle(inheritedPropsTitle);
            //     if (aliasedPageTitle) {
            //         pageIcon = await getPageIcon(aliasedPageTitle);
            //     }
            // }
        }
    }
    return pageIcon;
}

export const getAliasedPageIcon = async (pageTitle: string): Promise<string> => {
    let pageIcon = '';
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        pageIcon = await getPageIcon(aliasedPageTitle);
    }
    return pageIcon;
}

export const getInheritedPropsIcon = async (pageTitle: string): Promise<string> => {
    let pageIcon = '';
    const inheritedPropsTitle = await getInheritedPropsTitle(pageTitle, globalContext.pluginConfig?.featureInheritPageIcons);
    if (inheritedPropsTitle) {
        pageIcon = await getPageIcon(inheritedPropsTitle);
    }
    return pageIcon;
}

export const getAliasedPropsIcon = async (pageTitle: string): Promise<string> => {
    let pageIcon = '';
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        const inheritedPageTitle = await getInheritedPropsTitle(aliasedPageTitle, globalContext.pluginConfig?.featureInheritPageIcons);
        if (inheritedPageTitle) {
            pageIcon = await getPageIcon(inheritedPageTitle);
        }
    }
    return pageIcon;
}
