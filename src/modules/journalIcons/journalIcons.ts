import {
    globalContext,
    root, body
} from '../internal';

export const journalIconsLoad = async () => {
    if (!globalContext.pluginConfig?.featureJournalIcon) {
        return;
    }
    root.style.setProperty('--awesomeLinks-journal-icon', `"${globalContext.pluginConfig?.featureJournalIcon}"`);
    body.classList.add('is-awesomeLinks-journal');
}

export const journalIconsUnload = () => {
    root.style.removeProperty('--awesomeLinks-journal-icon');
    body.classList.remove('is-awesomeLinks-journal');
}

export const toggleJournalIconFeature = () => {
    if (globalContext.pluginConfig?.featureJournalIcon) {
        journalIconsLoad();
    } else {
        journalIconsUnload();
    }
}
