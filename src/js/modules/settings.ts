import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';

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
        description: 'Show site favicon for external links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featurePageIconsEnabled',
        title: '',
        description: 'Show page icon for internal links?',
        type: 'boolean',
        default: true,
    },
    {
        key: 'featureInheritPageIcons',
        title: '',
        description: 'Inherit page icon from custom property page',
        type: 'string',
        default: 'page-type',
    },
    {
        key: 'featureJournalIcon',
        title: '',
        description: 'Journal item icon: emoji or Nerd icon. Delete value to disable feature',
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
