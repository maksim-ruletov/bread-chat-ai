const { BrowserWindow, app, globalShortcut, ipcMain, nativeTheme, Tray } = require('electron');
const fs = require('fs');
const path = require('node:path');

const { Window, homeDir, Chats, Config,
        Loved, CustomTray, properties,
        ErrorLog, ipcWorker, Chat } = require(`${__dirname}/import.js`);

const { ActivateWindow, ChangeLanguage, ChangeTheme,
        ReloadWindow } = require(`${__dirname}/framework/system/ipcCallbacks.js`);
const { getBookmarks, endTutorial, changeHotkey,
        getHotkey, changeAutoOpenFirstChat,
        changeLoseFocus } = require(`${__dirname}/framework/system/ipcCallbacks.js`);
    
const localisation = {
    en: require(`${__dirname}/localisation/en.json`),
    ru: require(`${__dirname}/localisation/ru.json`)
}

const { Token } = require(`${__dirname}/core/core.token/token.js`);
const { TokenParser } = require(`${__dirname}/core/core.token/tokenParser.js`);
const { testFolders } = require(`${__dirname}/core/folderManager.js`);
const { ChatsManager } = require(`${__dirname}/core/core.chats/chatsManager.js`);
const { Validator } = require(`${__dirname}/core/core.validator/validator.js`);

const TYPES = {
    USER: 'question',
    AI: 'answer'
}

let parsedConfig;
let tray;

const windowManager = new Window("Bread AI Chat");
windowManager.SetWindowSize(600, 400);

properties.forEach(item => {
    windowManager.SetCustomSetting(item.name, item.value)
});
windowManager.SetupPreload(path.join(__dirname, 'preload.js'));

app.whenReady().then(() => {
    PreStartComparing();
    CreateWindow();
    parsedConfig = Config.DropConfigFile();

    registerMainHotkey();

    if (!parsedConfig.theme) {
        parsedConfig.theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

        Config.UpdateConfigFile(parsedConfig);
    }

    if (!parsedConfig['auto-launch'])
    {
        parsedConfig['auto-launch'] = true;

        Config.UpdateConfigFile(parsedConfig);

        app.setLoginItemSettings({
            openAtLogin: true    
        });
    }
    else
    {
        app.setLoginItemSettings({
            openAtLogin: parsedConfig['auto-launch']    
        });
    }

    nativeTheme.on('updated', (event) => {
        if (Config.DropConfigFile().theme === 'system') {
            let theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

            windowManager.DropWindow().webContents.send('change-theme', theme);
        }
    });

    app.on('activate', () => BrowserWindow.getAllWindows().length === 0 ? CreateWindow() : '');
    app.on('window-all-closed', () =>  process.platform !== 'darwin' ? app.quit() : '');

    tray = new CustomTray(`${__dirname}/media/bread-icon.png`)

    tray.AddHandler(localisation[parsedConfig['language']]['app.tray.open.label'] + ` (${Config.DropConfigFile()['global-hot-key']})`, OpenWindow);
    tray.AddHandler(localisation[parsedConfig['language']]['app.tray.favorites.label'], OpenFavorites);
    tray.AddHandler(localisation[parsedConfig['language']]['app.tray.settings.label'], OpenSettings);
    tray.AddHandler(localisation[parsedConfig['language']]['app.tray.quit.label'], app.quit);

    tray.CreateTray();

    tray._event('click', (event) => {
        OpenWindow();
    });

    if (ChatsManager.getChatsLength() === 0)
    {
        ChatsManager.createChat(localisation[Config.DropConfigFile().language]['templates.chat-name']);
    }

    const worker = new ipcWorker(ipcMain);

    worker._addListener('change-language', (_, language) => ChangeLanguage(language, parsedConfig));
    worker._addListener('change-theme', (_, theme) => ChangeTheme(theme, parsedConfig));
    worker._addListener('reload-window', () => ReloadWindow(windowManager, app));

    ipcMain.handle('active-window', () => ActivateWindow(windowManager));
    ipcMain.handle('get-bookmarks', getBookmarks);
    ipcMain.handle('end-tutorial', endTutorial);
    ipcMain.handle('get-version', () => windowManager.version);
    ipcMain.handle('change-hotkey', (event, hotkey) => {
        let result = changeHotkey(event, hotkey, unregisterMainHotkey, registerMainHotkey);

        tray._destroyTray();

        tray.handlers[0].label = localisation[parsedConfig['language']]['app.tray.open.label'] + ` (${Config.DropConfigFile()['global-hot-key']})`;
        
        tray.CreateTray();

        tray._event('click', (event) => {
            OpenWindow();
        });    

        return result;
    });
    ipcMain.handle('get-hotkey', getHotkey);
    ipcMain.handle('change-auto-open-first-chat', changeAutoOpenFirstChat);
    ipcMain.handle('change-lose-focus', (event, state) => changeLoseFocus(event, state, windowManager));

    ipcMain.handle('get-tokens', (event) => {
        return TokenParser.validate(TokenParser.parseFile());
    });

    ipcMain.handle('create-token', (event, service, token) => {
        let t_token = Token.createToken(service, token);
        t_token._parse();
        return t_token._normalize();
    });

    ipcMain.handle('get-active-token', (event) => {
        return Token.getActiveToken();
    });

    ipcMain.handle('change-active-token', (event, newActiveToken) => {
        return Token.setActiveToken(newActiveToken);
    });

    ipcMain.handle('reset-context', (event, chatId) => {
        Chat.resetContext(chatId);

        return {
            'ok': true
        }
    });

    ipcMain.handle('delete-token', (event, tokenIndex) => {
        new Token(tokenIndex)._deleteToken();

        return {
            'ok': true
        };
    });

    ipcMain.handle('get-real-theme', (event) => {
        return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    });

    ipcMain.handle('bookmark-message', (event, message) => {
        let t_bookmarks = Loved.DropLovedFile();

        if (t_bookmarks.includes(message)) {
            return {
                'ok': false,
                'code': 'MESSAGE_ALREADY_BOOKMARKED'
            }
        }

        t_bookmarks.push(message);

        Loved.UpdateLovedFile(t_bookmarks);

        return {
            'ok': true,
            'index': t_bookmarks.length - 1
        }
    });

    ipcMain.handle('remove-bookmark', (event, messageId) => {
        let t_bookmarks = Loved.DropLovedFile();

        t_bookmarks.splice(messageId, 1);

        Loved.UpdateLovedFile(t_bookmarks);

        return {
            'ok': true
        }
    });

    ipcMain.handle('@chatgpt3.5::send_message', (event, r_message) => {
        if (Validator.validateMessage(r_message) !== 0)
        {
            return {
                OK: false,
                ERROR: `MSG_CANT_BE_VALIDATE`
            }
        }

        let t_chat = ChatsManager.getChatById(r_message.FROM_CHAT);

        t_chat._parse();
        t_chat._sendMessage(r_message.MESSAGE, TYPES.USER);
        t_chat._upload();

        return {
            OK: true
        }
    });

    ipcMain.handle('@system::chats::create', (event, r_chatName) => {
        let t_chat = ChatsManager.createChat(r_chatName);

        if (typeof t_chat === 'object')
        {
            return {
                OK: true
            }
        }
        else
        {
            return {
                OK: false
            }
        }
    });

    ipcMain.handle('@system::chats::read', (event, r_chatId) => {
        let a_chat = null;

        if (r_chatId === 'first')
        {
            a_chat = ChatsManager.getFirstChat();
        }
        else
        {
            a_chat = ChatsManager.getChatById(r_chatId);
        }

        a_chat._parse();

        if (typeof a_chat === 'object')
        {
            return {
                OK: true,
                CHAT: a_chat
            }
        }
        else
        {
            return {
                OK: false
            }
        }
    });

    ipcMain.handle('@system::chats::getAll', (event) => {
        let t_cleanedChats = ChatsManager.getChats();
        let t_readyChats = [];

        t_cleanedChats.forEach(t_chat => {
            let t_localChat = ChatsManager.getChatById(t_chat.ID);

            t_readyChats.push({
                ID: t_chat.ID,
                NAME: t_localChat._getName()
            });
        });

        return {
            OK: true,
            CHATS: t_readyChats
        }
    });

    ipcMain.handle('@system::chats::delete', (event, r_chatId) => {
        let t_result = ChatsManager.deleteChat(r_chatId);

        return {
            OK: t_result === 0 ? true : false
        }
    });

    ipcMain.handle('@system::chats::rename', (event, r_chatId, r_newChatName) => {
        let t_chat = ChatsManager.getChatById(r_chatId);
        t_chat._parse();
        
        if (typeof t_chat !== 'object')
        {
            return {
                OK: false,
                CODE: t_chat
            }
        }
        else
        {
            t_chat._rename(r_newChatName);

            return {
                OK: true
            }
        }
    });

    ipcMain.handle('@system::chats::reset', (event, r_chatId) => {
        let t_chat = ChatsManager.getChatById(r_chatId);
        t_chat._parse();
        
        if (typeof t_chat !== 'object')
        {
            return {
                OK: false,
                CODE: t_chat
            }
        }
        else
        {
            t_chat._clear();
            t_chat._upload();

            return {
                OK: true
            }
        }
    });

    ipcMain.handle('@system::ai::sendMessage', async (event, r_chatId) => {
        const t_activeToken = Token.getActiveToken();

        if (typeof t_activeToken !== 'object')
        {
            return {
                OK: false,
                ERROR: 'TKN_NOT_FND'
            }
        }

        const { default: OpenAI } = require('openai');
        const t_stream = new OpenAI({
            apiKey: t_activeToken.value
        });
        let t_chat = ChatsManager.getChatById(r_chatId);
        t_chat._parse();

        if (typeof t_chat !== 'object')
        {
            return {
                OK: true,
                ERROR: 'CHAT_NOT_FOUND'
            }
        }
        else
        {
            let t_readyMessages = [];

            t_chat._chatMessages.forEach(t_message => {
                t_readyMessages.push({
                    role: t_message.TYPE === TYPES.USER ? 'user' : 'assistant',
                    content: t_message.TEXT
                });
            });

            let t_response = await t_stream.chat.completions.create({
                messages: t_readyMessages,
                model: 'gpt-3.5-turbo',
                stream: true
            });

            let result = '';

            for await (const chunk of t_response)
            {
                result += chunk.choices[0]?.delta?.content || '';
                event.sender.send('chatgpt:stream', result);
            }

            t_chat._sendMessage(result, TYPES.AI);
            t_chat._upload();
            event.sender.send('chatgpt:stream:stop');
        }
    });

    ipcMain.handle('@system::hotkeys::main::reset', (event) => {
        let config = Config.DropConfigFile();
        config['global-hot-key'] = 'Alt + Space';

        Config.UpdateConfigFile(config);

        unregisterMainHotkey();
        registerMainHotkey();

        return {
            OK: true
        }
    });

    ipcMain.handle('@system::app::auto-launch', (event, r_autoLaunchState) => {
        let config = Config.DropConfigFile();

        config['auto-launch'] = r_autoLaunchState;
    
        Config.UpdateConfigFile(config);

        app.setLoginItemSettings({
            openAtLogin: config['auto-launch']    
        });
    
        return {
            OK: true
        };
    });

    if (parsedConfig['lose-focus-on-blur']) {
        windowManager.DropWindow().on('blur', () => {
            windowManager.DropWindow().hide();
        });
    }
});

app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
        console.log("");
    });
    globalShortcut.register("F5", () => {
        console.log("");
    });
    globalShortcut.register("CapsLock", () => {
        console.log("");
    });
});

app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
    globalShortcut.unregister('CapsLock');
});

function PreStartComparing() {
    if (!fs.existsSync(`${homeDir}`)) fs.mkdir(`${homeDir}`, () => {})
    if (!fs.existsSync(`${homeDir}/BreadChatAI`)) fs.mkdir(`${homeDir}/BreadChatAI`, () => {})
    if (!fs.existsSync(`${homeDir}/BreadChatAI/chats`)) fs.mkdir(`${homeDir}/BreadChatAI/chats`, () => {})
    if (!fs.existsSync(`${homeDir}/BreadChatAI/.data`)) fs.mkdir(`${homeDir}/BreadChatAI/.data`, () => {})
    if (!fs.existsSync(`${homeDir}/BreadChatAI/.data/tokens.json`)) fs.appendFileSync(`${homeDir}/BreadChatAI/.data/tokens.json`, JSON.stringify({
        'activeToken': null,
        'list': []
    }, null, '\t'));
    testFolders();

    Config.CreateConfigFile();
    Loved.CreateLovedFile();
    Chats.CreateChatsFile();
    ErrorLog.CreateErrorLogFile();

    let config = Config.DropConfigFile();

    if (!config['language'] || !['en', 'ru'].includes(config.language)) {
        let langCode = app.getLocale().split('-')[0];

        if (!['en', 'ru'].includes(langCode)) langCode = 'en';

        config['language'] = langCode;

        Config.UpdateConfigFile(config);
    }
}

function CreateWindow() {
    windowManager.MakeWindow();
    windowManager.LoadScreen(`${__dirname}/UI/index.html`);
    windowManager.DropWindow().webContents.openDevTools();
    windowManager.DropWindow().removeMenu();
}

function SwitchWindowVisibility() {
    if (!windowManager.DropWindow().isVisible()) {
        windowManager.DropWindow().show();
    }
    else {
        windowManager.DropWindow().hide();
    }
}

function registerMainHotkey() {
    let config = Config.DropConfigFile();

    globalShortcut.register(config['global-hot-key'], () => {
        SwitchWindowVisibility();
        windowManager.DropWindow().webContents.send('focus');
    });
}

function unregisterMainHotkey() {
    globalShortcut.unregisterAll();
}

function OpenSettings() {
    windowManager.DropWindow().webContents.send('render-settings');
}

function OpenFavorites() {
    windowManager.DropWindow().webContents.send('render-bookmarks');
}

function OpenWindow() {
    windowManager.DropWindow().show();
    windowManager.DropWindow().webContents.send('focus');
}