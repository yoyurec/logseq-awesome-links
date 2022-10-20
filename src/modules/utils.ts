//@ts-ignore
import tinycolor from 'tinycolor2';

import { globalContext } from './internal';

export const objectDiff = (orig: object, updated: object) => {
    const difference = Object.keys(orig).filter((key) => {
        if (key === 'presetCustom') {
            return false
        }
        // @ts-ignore
        return orig[key] !== updated[key]
    });
    return difference;
}

export const checkUpdate = async () => {
    const response = await fetch(
        `https://api.github.com/repos/yoyurec/${globalContext.pluginID}/releases/latest`,
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
        const hasUpdate = latestVersion.localeCompare(globalContext.pluginVersion, undefined, { numeric: true, sensitivity: 'base' });
        if (hasUpdate == 1) {
            logseq.UI.showMsg(`"${globalContext.pluginID}" new version is available! Please, update!`, 'warning', {timeout: 30000});
        }
    }
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

export const isNeedLowContrastFix = (color: string) => {
    const readability = tinycolor.readability(color, globalContext.themeBg);
    return (readability < 1.7) ? true : false;
}
