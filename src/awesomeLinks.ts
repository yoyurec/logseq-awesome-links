import '@logseq/libs';
import { pluginLoad } from './plugin/plugin';
import { settingsLoad } from './plugin/settings';

// Main logseq on ready
const main = async () => {
    console.log(`AwesomeIcons: plugin loaded`);
    settingsLoad();
    pluginLoad();
};

logseq.ready(main).catch(null);
