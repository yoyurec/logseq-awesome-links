//@ts-ignore
import { hasBadContrast } from 'color2k';
import { doc, globals, propsObject } from './globals';

export const objectDiff = (orig: object, updated: object) => {
    const difference = Object.keys(orig).filter((key) => {
        // @ts-ignore
        return orig[key] !== updated[key]
    });
    return difference;
}

export const checkUpdate = async () => {
    const response = await fetch(
        `https://api.github.com/repos/yoyurec/${globals.pluginID}/releases/latest`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const repoInfo = await response.json();
    if (repoInfo) {
        const latestVersion = repoInfo.tag_name.replace('v', '');
        // https://stackoverflow.com/a/65687141
        const hasUpdate = latestVersion.localeCompare(globals.pluginVersion, undefined, { numeric: true, sensitivity: 'base' });
        if (hasUpdate == 1) {
            logseq.UI.showMsg(`"${globals.pluginID}" new version is available! Please, update!`, 'warning', {timeout: 30000});
        }
    }
}

export const getBase64FromUrlWithCache = async (url: string): Promise<string> => {
    if (globals.favIconsCache[url]) {
        return globals.favIconsCache[url];
    }
    const favicon = await getBase64FromUrl(url);
    globals.favIconsCache[url] = favicon;
    return favicon;
}

// Generate Base64 from image URL
export const getBase64FromUrl = async (url: string): Promise<string> => {
    let data;
    try {
        data = await fetch(url);
    } catch (error) {
        return '';
    }
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
        }
    });
}

export const isNeedLowContrastFix = (color: string, bg: string) => {
    return hasBadContrast(color, 'decorative', bg) ? true : false;
}

export const settingsTextToPropsObj = (settingsText: string): propsObject => {
    const defaultPageProps = Object.create(null);
    const pagePropsArr = settingsText.split('\n');
    const pageIconMatch = pagePropsArr.find(
        (el: string) => el.includes('icon::')
    );
    if (pageIconMatch) {
        const iconPropArr = pageIconMatch.split('::');
        if (iconPropArr) {
            defaultPageProps.icon = iconPropArr[1].trim();
        }
    }
    const pageColorMatch = pagePropsArr.find(
        (el: string) => el.includes('color::')
    );
    if (pageColorMatch) {
        const colorPropArr = pageColorMatch.split('::');
        if (colorPropArr) {
            defaultPageProps.color = colorPropArr[1].trim();
        }
    }
    return defaultPageProps;
}

export const isEmoji = (text: string): boolean => {
    const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;
    return regex_emoji.test(text);
}

export const injectPluginCSS = (iframeId: string, label: string, cssContent: string) => {
    const pluginIframe = doc.getElementById(iframeId) as HTMLIFrameElement;
    if (!pluginIframe) {
        return
    }
    ejectPluginCSS(iframeId, label);
    pluginIframe.contentDocument?.head.insertAdjacentHTML(
        'beforeend',
        `<style id='${label}'>
            ${cssContent}
        </style>`
    );
}

export const ejectPluginCSS = (iframeId: string, label: string) => {
    const pluginIframe = doc.getElementById(iframeId) as HTMLIFrameElement;
    if (!pluginIframe) {
        return;
    }
    pluginIframe.contentDocument?.getElementById(label)?.remove();
}
