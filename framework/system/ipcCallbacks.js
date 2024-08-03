const { Chat, Chats, Loved } = require('../../import.js');
const { Config } = require('../filesystem/Config.js');

/**
 * Открытие окна
 * @param {Window} windowManager 
 */
exports.ActivateWindow = (windowManager) => {
    windowManager.DropWindow().show();
}

/**
 * Изменение языка
 * @param {string} language 
 * @param {Object} parsedConfig 
 */
exports.ChangeLanguage = (language, parsedConfig) => {
    if (['en', 'ru'].includes(language)) {
        parsedConfig.language = language;

        Config.UpdateConfigFile(parsedConfig);
    }
}

/**
 * Смена темы
 * @param {string} theme 
 * @param {Object} parsedConfig 
 */
exports.ChangeTheme = (theme, parsedConfig) => {
    if (['dark', 'light', 'system'].includes(theme)) {
        parsedConfig.theme = theme;

        Config.UpdateConfigFile(parsedConfig);
    }
}

/**
 * Перезагрузка окна
 * @param {Window} windowManager 
 * @param {Electron.App} app 
 */
exports.ReloadWindow = (windowManager, app) => {
    app.exit();
    app.relaunch();
}

/**
 * Create new chat
 * @param {Event} event 
 * @param {string} chatName 
 */
exports.createChat = (event, chatName) => {
    let chatData = Chat._createChat(chatName);

    return {
        'ok': true,
        chatData
    };
}

/**
 * Get all chats
 * @param {Event} event 
 */
exports.getChats = (event) => {
    return JSON.stringify(Chats.DropChatsFile());
}

/**
 * Delete chat by chatId
 * @param {Event} event 
 * @param {string} chatId 
 */
exports.deleteChat = (event, chatId) => {
    const CHATS = Chats.DropChatsFile();

    if (!CHATS.find(item => item.chatId === chatId)) {
        return JSON.stringify({
            'ok': false,
            'error': `CHAT_NOT_FOUND`
        });
    }
    else {
        Chat._deleteChat(chatId);

        return JSON.stringify({
            'ok': true
        });
    }
}

/**
 * Get all information about chat
 * @param {Event} event 
 * @param {string} chatId 
 */
exports.readChat = (event, chatId) => {
    const CHATS = Chats.DropChatsFile();

    if (chatId === 'first') {
        chatId = CHATS[0].chatId;
    }

    if (!CHATS.find(item => item.chatId === chatId)) {
        return JSON.stringify({
            'ok': false,
            'error': `CHAT_NOT_FOUND`
        });
    }
    else {
        return Chat._readChat(chatId);
    }
}

/**
 * Save message into the chat
 * @param {Event} event 
 * @param {string} chatId 
 * @param {string} message
 */
exports.saveMessage = (event, chatId, message) => {
    const CHATS = Chats.DropChatsFile();

    if (!CHATS.find(item => item.chatId === chatId)) {
        return {
            'ok': false,
            'error': `CHAT_NOT_FOUND`
        };
    }
    else {
        Chat._saveMessage(chatId, message);

        return {
            'ok': true
        };
    }
}

/**
 * Get all bookmarks
 * @param {Event} event 
 */
exports.getBookmarks = (event) => {
    return Loved.DropLovedFile();
}

/**
 * Send all messages to ChatGPT
 * @param {Event} event 
 * @param {string} chatId 
 */
exports.sendToChatgpt = async (event, chatId, activeToken) => {
    const { default: OpenAI } = require('openai');

    const openAi = new OpenAI({
        apiKey: activeToken
    });

    let chat = new Chat(chatId);
    let context = [];

    chat.Parse();

    chat.chatParsedFile.messages.forEach(item => {
        context.push({
            'role': item.type == 'question' ? 'user' : 'assistant',
            'content': item.message 
        });
    });

    const response = await openAi.chat.completions.create({
        messages: context,
        model: 'gpt-3.5-turbo',
    })

    Chat._saveMessage(chatId, response.choices[0].message.content, 'answer');

    return response.choices[0].message.content;
}

/**
 * End tutorial
 * @param {Event} event 
 */
exports.endTutorial = (event) => {
    let config = Config.DropConfigFile();

    config['checked-tutorial'] = true;

    Config.UpdateConfigFile(config);

    return "ok";
}

/**
 * Change window control hotkey
 * @param {Event} event 
 * @param {string} hotkey 
 */
exports.changeHotkey = (event, hotkey, unregisterMainHotkey, registerMainHotkey) => {
    let config = Config.DropConfigFile();

    config['global-hot-key'] = hotkey;

    Config.UpdateConfigFile(config);

    unregisterMainHotkey();
    registerMainHotkey();

    return {
        'ok': true
    }
}

/**
 * Get window control hotkey
 * @param {Event} event 
 */
exports.getHotkey = (event) => {
    return Config.DropConfigFile()['global-hot-key'];
}

/**
 * Change option that controls opening
 * first chat on start
 * @param {Event} event 
 * @param {boolean} state 
 */
exports.changeAutoOpenFirstChat = (event, state) => {
    let config = Config.DropConfigFile();

    config['open-first-chat'] = state;

    Config.UpdateConfigFile(config);
}

exports.changeLoseFocus = (event, state, windowManager) => {
    let config = Config.DropConfigFile();

    config['lose-focus-on-blur'] = state;

    Config.UpdateConfigFile(config);

    function blurHandler() {
        windowManager.DropWindow().hide();
    }

    if (state === true) {
        windowManager.DropWindow().on('blur', blurHandler);
    }
    else {
        windowManager.DropWindow().removeAllListeners();
    }
}