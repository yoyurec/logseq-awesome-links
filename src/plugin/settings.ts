import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';
import { toggleFaviconsFeature, toggleInheritExtColor } from '../modules/favIcons/favIcons';
import { globals } from '../modules/globals';
import { toggleIconFontFeature } from '../modules/iconFont/iconFont';
import { toggleIconsFeature } from '../modules/pageIcons/pageIcons';

import { objectDiff, settingsTextToPropsObj } from '../modules/utils';

import './settings.css';
import { settingsConfig } from './settingsConfig';

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globals.pluginConfig = logseq.settings;

    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });
 }

const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globals.defaultPageProps = settingsTextToPropsObj(globals.pluginConfig.defaultPageProps);
    globals.defaultJournalProps = settingsTextToPropsObj(globals.pluginConfig.defaultJournalProps);

    globals.pluginConfig = { ...settings };
    const settingsDiff = objectDiff({ ...oldSettings }, globals.pluginConfig)
    if (settingsDiff.includes('faviconsEnabled')) {
        toggleFaviconsFeature();
    }
    if (settingsDiff.includes('inheritExtColor')) {
        toggleInheritExtColor();
    }
    if (settingsDiff.includes('pageIconsEnabled') || settingsDiff.includes('inheritFromHierarchy') || settingsDiff.includes('defaultJournalProps') || settingsDiff.includes('fixLowContrast')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('iconFont')) {
        toggleIconFontFeature();
    }
}
