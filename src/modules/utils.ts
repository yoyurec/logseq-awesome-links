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
        const version = repoInfo.tag_name.replace('v', '');
        // https://stackoverflow.com/a/65687141
        version.localeCompare(globalContext.pluginVersion, undefined, { numeric: true, sensitivity: 'base' })
    }
    logseq.UI.showMsg(`"${globalContext.pluginID}" new version is available! Please, update!`, 'warning', {timeout: 30000});
}
