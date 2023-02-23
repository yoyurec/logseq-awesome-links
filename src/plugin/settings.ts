import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';
import { toggleFaviconsFeature, toggleInheritExtColor } from '../modules/favIcons/favIcons';
import { globalContext } from '../modules/globals';
import { toggleNerdFonFeature } from '../modules/nerdFont/nerdFont';
import { toggleIconsFeature } from '../modules/pageIcons/pageIcons';

import { objectDiff, settingsTextToPropsObj } from '../modules/utils';

import './settings.css';
import { settingsConfig } from './settingsConfig';

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globalContext.pluginConfig = logseq.settings;

    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });
 }

const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globalContext.defaultPageProps = settingsTextToPropsObj(globalContext.pluginConfig.defaultPageProps);
    globalContext.defaultJournalProps = settingsTextToPropsObj(globalContext.pluginConfig.defaultJournalProps);

    globalContext.pluginConfig = { ...settings };
    const settingsDiff = objectDiff({ ...oldSettings }, globalContext.pluginConfig)
    if (settingsDiff.includes('faviconsEnabled')) {
        toggleFaviconsFeature();
    }
    if (settingsDiff.includes('inheritExtColor')) {
        toggleInheritExtColor();
    }
    if (settingsDiff.includes('pageIconsEnabled') || settingsDiff.includes('inheritFromHierarchy') || settingsDiff.includes('defaultJournalProps') || settingsDiff.includes('fixLowContrast')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('nerdFontEnabled')) {
        toggleNerdFonFeature();
    }
}
