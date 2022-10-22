import '@logseq/libs';
import { globalContext } from '../internal';

export interface propsObject {
    icon?: string;
    "icon-url"?: string;
    icon2?: string;
    "icon-url2"?: string;
    color?: string;
    needStroke?: boolean;
}

export const isJournalType = async (title: string): Promise<boolean> => {
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
        const journalDefaultProps = Object.create(null);
        const journalPropsArr = globalContext.pluginConfig.defaultJournalProps.split('\n');
        const journalIconMatch = journalPropsArr.find(
            (el: string) => el.includes('icon::')
        );
        if (journalIconMatch) {
            const iconPropArr = journalIconMatch.split('::');
            if (iconPropArr) {
                journalDefaultProps.icon = iconPropArr[1].trim();
            }
        }
        const journalColorMatch = journalPropsArr.find(
            (el: string) => el.includes('color::')
        );
        if (journalColorMatch) {
            const colorPropArr = journalColorMatch.split('::');
            if (colorPropArr) {
                journalDefaultProps.color = colorPropArr[1].trim();
            }
        }
        pageProps = { ...journalDefaultProps, ...pageProps };
    } else {
        const queryResultArr = await logseq.DB.datascriptQuery(iconQuery);
        if(queryResultArr.length && queryResultArr[0].length){
            const row = queryResultArr[0][0];
            if (row.icon) {
                pageProps.icon = row.icon;
            }
            if (row.color) {
                pageProps.color = row.color.replaceAll('"', '');
            }
            if (row[".icon-url"] || row["icon-url"]) {
                pageProps["icon-url"] = row[".icon-url"] || row["icon-url"];
            }
            if (row[".icon2"] || row["icon2"]) {
                pageProps.icon2 = row[".icon2"] || row["icon2"];
            }
            if (row[".icon-url2"] || row["icon-url2"]) {
                pageProps["icon-url2"] = row[".icon-url2"] || row["icon-url2"];
            }
        }
    }
    return pageProps;
}

export const getInheritedPropsTitle = async (title: string, prop: string): Promise<string> => {
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
        inheritedPageTitle = titleArr[0][0][0].toLowerCase();
    }
    return inheritedPageTitle;
}

export const getAliasedPageTitle = async (title: string): Promise<string> => {
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
        aliasedPageTitle = aliasArr[0][0].toLowerCase();
    }
    return aliasedPageTitle;
}

export const getPropsByPageName = async (pageTitle: string): Promise<propsObject> => {
    // get from own page
    let pageProps = await getPageProps(pageTitle);
    let resultedPageProps = { ...pageProps };
    if (!resultedPageProps['icon'] || !resultedPageProps['color']) {
        // get from aliased page
        pageProps = await getAliasedPageProps(pageTitle);
        resultedPageProps = { ...pageProps, ...resultedPageProps };
        if ((!resultedPageProps['icon'] || !resultedPageProps['color']) && globalContext.pluginConfig.inheritFromProp) {
            // inherited from page props, when props linked to page
            pageProps = await getInheritedPropsProps(pageTitle);
            resultedPageProps = { ...pageProps, ...resultedPageProps };
            if ((!resultedPageProps['icon'] || !resultedPageProps['color'])) {
                // inherited from aliased page props, when props linked to page
                pageProps = await getAliasedPropsProps(pageTitle);
                resultedPageProps = { ...pageProps, ...resultedPageProps };
            }
        }
        if (globalContext.pluginConfig.inheritFromHierarchy && pageTitle.includes('/') && (!resultedPageProps['icon'] || !resultedPageProps['color'])) {
            // inherit from hierarchy root
            pageProps = await getHierarchyPageProps(pageTitle);
            resultedPageProps = { ...pageProps, ...resultedPageProps };
        }
    }
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
    const inheritedPropsTitle = await getInheritedPropsTitle(pageTitle, globalContext.pluginConfig.inheritFromProp);
    if (inheritedPropsTitle) {
        pageProps = await getPageProps(inheritedPropsTitle);
    }
    return pageProps;
}

export const getAliasedPropsProps = async (pageTitle: string): Promise<propsObject> => {
    let pageProps: propsObject = Object.create(null);
    const aliasedPageTitle = await getAliasedPageTitle(pageTitle);
    if (aliasedPageTitle) {
        const inheritedPageTitle = await getInheritedPropsTitle(aliasedPageTitle, globalContext.pluginConfig.inheritFromProp);
        if (inheritedPageTitle) {
            pageProps = await getPageProps(inheritedPageTitle);
        }
    }
    return pageProps;
}
