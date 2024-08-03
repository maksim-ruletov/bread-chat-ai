exports.Window = require('./framework/system/Window.js').Window;
exports.Config = require('./framework/filesystem/Config.js').Config;
exports.Loved = require('./framework/filesystem/Loved.js').Loved;
exports.homeDir = require('./framework/filesystem/Utils.js').homeDir;
exports.CustomTray = require('./framework/system/CustomTray.js').CustomTray;
exports.ErrorLog = require('./framework/system/ErrorLog.js').ErrorLog;
exports.Chats = require('./framework/filesystem/Chats.js').Chats;
exports.ipcWorker = require('./framework/system/ipcWorker.js').ipcWorker;
exports.Chat = require('./framework/chat/Chat.js').Chat;

exports.properties = [
    { name: 'autoHideMenuBar', value: true },
    { name: 'fullScreenable', value: false },
    { name: 'resizable', value: false },
    { name: 'movable', value: false },
    { name: 'alwaysOnTop', value: true },
    { name: 'skipTaskbar', value: true },
    { name: 'webPreferences', value: {} },
    { name: 'frame', value: false }
];