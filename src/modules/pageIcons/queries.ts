import '@logseq/libs';
import { globalContext } from '../internal';

interface propsObject {
    [key: string]: string;
}

export const getPageProps = async (title: string): Promise<propsObject> => {
    let pageProps: propsObject = {};
    title = title.toLowerCase();
    const iconQuery = `
    [
      :find ?props
      :where
          [?id :block/name "${title}"]
          [?id :block/properties ?props]
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
    const queryResultArr = await logseq.DB.datascriptQuery(iconQuery);
    if (queryResultArr.length) {
        pageProps = queryResultArr[0][0];
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

export const searchProps = async (pageTitle: string): Promise<propsObject> => {
    // get from page
    let pageProps = await getPageProps(pageTitle);
    let resultedPageProps = { ...pageProps };
    if (!pageProps['icon'] || !pageProps['color']) {
        // get from aliased page
        pageProps = await getAliasedPageProps(pageTitle);
        resultedPageProps = { ...pageProps, ...resultedPageProps };
        if ((!pageProps['icon'] || !pageProps['color']) && globalContext.pluginConfig?.featureInheritPageIcons) {
            // inherited from page props, when props linked to page
            pageProps = await getInheritedPropsProps(pageTitle);
            resultedPageProps = { ...pageProps, ...resultedPageProps };
            if ((!pageProps['icon'] || !pageProps['color'])) {
                // inherited from aliased page props, when props linked to page
                pageProps = await getAliasedPropsProps(pageTitle);
                resultedPageProps = { ...pageProps, ...resultedPageProps };
                if ((!pageProps['icon'] || !pageProps['color']) && pageTitle.includes('/')) {
                    // inherit from hierarchy root
                    pageProps = await getHierarchyPageProps(pageTitle);
                    resultedPageProps = { ...pageProps, ...resultedPageProps };
                }
            }
        }
    }
    return resultedPageProps;
}

export const getHierarchyPageProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = {};
    pageTitle = pageTitle.split('/')[0];
    pageProps = await getPageProps(pageTitle);
    if (!pageProps['icon']) {
        pageProps = await getInheritedPropsProps(pageTitle);
    }
    return pageProps;
}

export const getAliasedPageProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = {};
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        pageProps = await getPageProps(aliasedPageTitle);
    }
    return pageProps;
}

export const getInheritedPropsProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = {};
    const inheritedPropsTitle = await getInheritedPropsTitle(pageTitle, globalContext.pluginConfig?.featureInheritPageIcons);
    if (inheritedPropsTitle) {
        pageProps = await getPageProps(inheritedPropsTitle);
    }
    return pageProps;
}

export const getAliasedPropsProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = {};
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        const inheritedPageTitle = await getInheritedPropsTitle(aliasedPageTitle, globalContext.pluginConfig?.featureInheritPageIcons);
        if (inheritedPageTitle) {
            pageProps = await getPageProps(inheritedPageTitle);
        }
    }
    return pageProps;
}
