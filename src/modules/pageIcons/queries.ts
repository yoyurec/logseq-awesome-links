import '@logseq/libs';
import { propsObject, globals } from '../globals';

export const getLinkedPagesNumber = async (title: string): Promise<number> => {
    title = title.toLowerCase();
    let linkedPagesNumber = 0;
    const linkedQuery = `
    [
        :find (pull ?b [:block/page])
        :where
            [?b :block/page ?page]
            [?b :block/refs ?ref-page]
            [?ref-page :block/name "${title}"]
    ]
    `;
    const linkedPages = await logseq.DB.datascriptQuery(linkedQuery);
    if (linkedPages.length) {
        linkedPagesNumber = linkedPages.length;
    }
    return linkedPagesNumber;
}

export const isJournalType = async (title: string): Promise<boolean> => {
    title = title.toLowerCase();
    const journalQuery = `
    [
      :find ?isjournal
      :where
          [?id :block/name "${title}"]
          [?id :block/journal? ?isjournal]
    ]
    `;
    const isJournal = await logseq.DB.datascriptQuery(journalQuery);
    if (isJournal[0] && isJournal[0][0]) {
        return true;
    }
    return false;
}

export const getPageProps = async (title: string): Promise<propsObject> => {
    const origTitle = title;
    title = title.toLowerCase();
    let pageProps: propsObject = Object.create(null);
    const iconQuery = `
    [
      :find ?props
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?props]
    ]
    `;
    const isJournal = await isJournalType(title);
    if (isJournal) {
        pageProps = globals.defaultJournalProps;
    } else {
        const queryResultArr = await logseq.DB.datascriptQuery(iconQuery);
        if (queryResultArr[0] && queryResultArr[0][0] && queryResultArr[0][0].icon) {
            pageProps.icon = queryResultArr[0][0].icon;
        }
        if (queryResultArr[0] && queryResultArr[0][0] && queryResultArr[0][0]['icon-font']) {
            pageProps.iconFont = queryResultArr[0][0]['icon-font'];
        }
        if (queryResultArr[0] && queryResultArr[0][0] && queryResultArr[0][0].color) {
            pageProps.color = queryResultArr[0][0].color.replaceAll('"', '');
        }
        if (queryResultArr[0] && queryResultArr[0][0] && queryResultArr[0][0].hidetitle) {
            pageProps.hidetitle = queryResultArr[0][0].hidetitle;
            pageProps.hidetitletext = origTitle;
        }
    }
    return pageProps;
}

export const getInheritedPropsTitle = async (title: string, prop: string): Promise<string> => {
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

export const getAliasedPageTitle = async (title: string): Promise<string> => {
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

export const getPropsByPageName = async (pageTitle: string): Promise<propsObject> => {
    let resultedPageProps: propsObject = Object.create(null);
    // get from own page
    let pageProps = await getPageProps(pageTitle);
    if (pageProps) {
        resultedPageProps = { ...pageProps };
    }
    if (!resultedPageProps['icon'] || !resultedPageProps['color']) {
        // get from aliased page
        pageProps = await getAliasedPageProps(pageTitle);
        if (pageProps) {
            resultedPageProps = { ...pageProps, ...resultedPageProps };
        }
        if ((!resultedPageProps['icon'] || !resultedPageProps['color']) && globals.pluginConfig.inheritFromProp) {
            // inherited from page props, when props linked to page
            pageProps = await getInheritedPropsProps(pageTitle);
            if (pageProps) {
                resultedPageProps = { ...pageProps, ...resultedPageProps };
            }
            if ((!resultedPageProps['icon'] || !resultedPageProps['color'])) {
                // inherited from aliased page props, when props linked to page
                pageProps = await getAliasedPropsProps(pageTitle);
                if (pageProps) {
                    resultedPageProps = { ...pageProps, ...resultedPageProps };
                }
            }
        }
        if (globals.pluginConfig.inheritFromHierarchy && pageTitle.includes('/') && (!resultedPageProps['icon'] || !resultedPageProps['color'])) {
            // inherit from hierarchy root
            pageProps = await getHierarchyPageProps(pageTitle);
            resultedPageProps = { ...pageProps, ...resultedPageProps };
        }
    }
    resultedPageProps = { ...globals.defaultPageProps, ...resultedPageProps };
    //@ts-ignore
    resultedPageProps.__proto__ = null;
    return resultedPageProps;
}

export const getHierarchyPageProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = Object.create(null);
    pageTitle = pageTitle.split('/')[0];
    pageProps = await getPageProps(pageTitle);
    let resultedPageProps = { ...pageProps };
    if (!pageProps['icon'] || !pageProps['color']) {
        pageProps = await getInheritedPropsProps(pageTitle);
        resultedPageProps = { ...pageProps, ...resultedPageProps };
    }
    return resultedPageProps;
}

export const getAliasedPageProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = Object.create(null);
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        pageProps = await getPageProps(aliasedPageTitle);
    }
    return pageProps;
}

export const getInheritedPropsProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = Object.create(null);
    const inheritedPropsTitle = await getInheritedPropsTitle(pageTitle, globals.pluginConfig.inheritFromProp);
    if (inheritedPropsTitle) {
        pageProps = await getPageProps(inheritedPropsTitle);
    }
    return pageProps;
}

export const getAliasedPropsProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = Object.create(null);
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        const inheritedPageTitle = await getInheritedPropsTitle(aliasedPageTitle, globals.pluginConfig.inheritFromProp);
        if (inheritedPageTitle) {
            pageProps = await getPageProps(inheritedPageTitle);
        }
    }
    return pageProps;
}
