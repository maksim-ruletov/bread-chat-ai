const { ipcRenderer, contextBridge, shell } = require('electron');
const localisation = {
    en: require('./localisation/en.json'),
    ru: require('./localisation/ru.json')
}

contextBridge.exposeInMainWorld('api', {
    ipcRenderer,
    config: require('./framework/filesystem/Config.js').Config.DropConfigFile(),
    getConfig: () => require('./framework/filesystem/Config.js').Config.DropConfigFile(),
    localisation,
    shell,
    appdata: process.env.APPDATA,
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    on: (channel, callable) => ipcRenderer.on(channel, callable),
    remove: (channel, callable) => ipcRenderer.removeListener(channel, callable),
    removeAll: (channel) => ipcRenderer.removeAllListeners(channel)
});