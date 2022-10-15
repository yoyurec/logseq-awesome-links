import { SettingSchemaDesc, LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin.user';

import {
    globalContext,
    toggleFaviconsFeature, toggleIconsFeature, toggleNerdFonFeature
} from '../internal';
import { objectDiff } from '../utils';

import './settings.css';

export const settingsConfig: SettingSchemaDesc[] = [
    {
        key: 'promoAwesomeStyler',
        title: '',
        description: '⚡ Also try "Awesome Styler" theme with lots of UI changes and more features! ⚡ https://github.com/yoyurec/logseq-awesome-styler',
        type: 'boolean',
        default: false,
    },
    {
        key: 'featureFaviconsEnabled',
        title: '',
        description: 'Enable feature: favicons for external links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featurePageIconsEnabled',
        title: '',
        description: 'Enable feature: icon/color for internal pages?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureInheritPageIcons',
        title: '',
        description: 'Inherit page icon/color via custom property page (delete to disable)',
        type: 'string',
        default: 'page-type',
    },
    {
        key: 'featureHierarchyPageIcons',
        title: '',
        description: 'Inherit page icon/color via hierarchy?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureJournalIcon',
        title: '',
        description: 'Journal item icon: emoji or Nerd icon (delete to disable)',
        type: 'string',
        default: '',
    },
    {
        key: 'featureNerdFontEnabled',
        title: '',
        description: 'Enable Nerd font with tons of icons (https://www.nerdfonts.com/cheat-sheet)',
        type: 'boolean',
        default: true,
    }
];

export const settingsLoad = () => {
    logseq.useSettingsSchema(settingsConfig);
    globalContext.pluginConfig = logseq.settings;

    logseq.onSettingsChanged((settings, oldSettings) => {
        onSettingsChangedCallback(settings, oldSettings);
    });
 }

const onSettingsChangedCallback = (settings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    globalContext.pluginConfig = { ...settings };
    const settingsDiff = objectDiff({ ...oldSettings }, globalContext.pluginConfig)
    if (settingsDiff.includes('featureFaviconsEnabled')) {
        toggleFaviconsFeature();
    }
    if (settingsDiff.includes('featurePageIconsEnabled')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('featureJournalIcon')) {
        toggleIconsFeature();
    }
    if (settingsDiff.includes('featureNerdFontEnabled')) {
        toggleNerdFonFeature();
    }
}
