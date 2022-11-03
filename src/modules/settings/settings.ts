import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import {
    globalContext,
    settingsConfig,
    toggleFaviconsFeature, toggleIconsFeature, toggleNerdFonFeature
} from '../internal';
import { objectDiff, settingsTextToPropsObj } from '../utils';

import './settings.css';

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
    if (settingsDiff.includes('pageIconsEnabled') || settingsDiff.includes('inheritFromHierarchy') || settingsDiff.includes('defaultJournalProps') || settingsDiff.includes('fixLowContrast')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('nerdFontEnabled')) {
        toggleNerdFonFeature();
    }
}
