import '@logseq/libs';

import {
    pluginLoad,
    settingsLoad,
} from './modules/internal';


// Main logseq on ready
const main = async () => {
    console.log(`AwesomeIcons: plugin loaded`);
    settingsLoad();
    pluginLoad();
};

logseq.ready(main).catch(null);
