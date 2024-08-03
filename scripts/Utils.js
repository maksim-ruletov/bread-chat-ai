function objectsEqual(o1, o2) {
    const entries1 = Object.entries(o1);
    const entries2 = Object.entries(o2);

    if (entries1.length !== entries2.length) {
        return false;
    }
    for (let i = 0; i < entries1.length; ++i) {
        if (entries1[i][0] !== entries2[i][0]) {
            return false;
        }
        if (entries1[i][1] !== entries2[i][1]) {
            return false;
        }
    }
  
    return true;
}

function OneFieldIsTrue(o1) {
    let item = Object.values(o1).find(item => item === true);

    if (item == undefined) return false;

    return true;
}

function WhatIsCurrentOpened() {
    if (SETTINGS_MANAGER._getSettingsScreenState()) {
        return 'settings';
    }
    else if (CHATS_MANAGER._getChatsScreenState()) {
        return 'chats';
    }
    else if (CHAT_WORKER._hasActiveChat()) {
        return 'chat';
    }
    else if (BOOKMARKS_MANAGER._getBookmarksScreenState()) {
        return 'bookmarks';
    }
    
    return 'nothing';
}

/**
 * Close all element expets one of them
 * 
 * @param {"settings"|"chats"|"chat"|"bookmarks"} exceptedElement 
 */
function closeAllExceptOne(exceptedElement) {
    switch(exceptedElement) {
    case "settings":
        if (CHATS_MANAGER._getChatsScreenState()) {
            CHATS_MANAGER._hideChats();
        }

        if (CHAT_WORKER._hasActiveChat()) {
            CHAT_WORKER._closeActiveChat(INPUT_BOX_MANAGER, WELCOME_SCREEN_MANAGER);
        }

        if (BOOKMARKS_MANAGER._getBookmarksScreenState()) {
            BOOKMARKS_MANAGER._hideBookmarks();
        }

        break;
    case "chats":
        if (SETTINGS_MANAGER._getSettingsScreenState()) {
            SETTINGS_MANAGER._hideSettings();
        }

        if (CHAT_WORKER._hasActiveChat()) {
            CHAT_WORKER._closeActiveChat(INPUT_BOX_MANAGER, WELCOME_SCREEN_MANAGER);
        }

        if (BOOKMARKS_MANAGER._getBookmarksScreenState()) {
            BOOKMARKS_MANAGER._hideBookmarks();
        }

        break;
    case "chat":
        if (SETTINGS_MANAGER._getSettingsScreenState()) {
            SETTINGS_MANAGER._hideSettings();
        }

        if (CHATS_MANAGER._getChatsScreenState()) {
            CHATS_MANAGER._hideChats();
        }

        if (BOOKMARKS_MANAGER._getBookmarksScreenState()) {
            BOOKMARKS_MANAGER._hideBookmarks();
        }

        break;
    case "bookmarks":
        if (SETTINGS_MANAGER._getSettingsScreenState()) {
            SETTINGS_MANAGER._hideSettings();
        }

        if (CHATS_MANAGER._getChatsScreenState()) {
            CHATS_MANAGER._hideChats();
        }

        if (CHAT_WORKER._hasActiveChat()) {
            CHAT_WORKER._closeActiveChat(INPUT_BOX_MANAGER, WELCOME_SCREEN_MANAGER);
        }

        break;
    default:
        console.error(`element ${exceptedElement} can't be handled.`);
    }
}