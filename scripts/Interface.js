class SettingsManager {
    constructor() {
        this._settingsScreenState = false;
    }

    _showSettings() {
        if (!this._getSettingsScreenState()) {
            $('.settings').css({
                'z-index': 102
            });
    
            $('.settings').animate({
                opacity: 1
            }, ANIMATION_TIME);
            
            this._settingsScreenState = true;
        }
    }

    _hideSettings() {
        if (this._getSettingsScreenState()) {
            $('.settings').animate({
                opacity: 0
            }, ANIMATION_TIME, () => {
                $('.settings').css({
                    'z-index': -102
                });

                this._settingsScreenState = false;
            });
        }
    }

    _getSettingsScreenState() {
        return this._settingsScreenState;
    }

    /**
     * @param {ChatsManager} chatsManager 
     * @param {BookmarksManager} bookmarksManager  
     */
    _switchSettingsScreenState(chatsManager, bookmarksManager) {
        if (!chatsManager._getChatsScreenState() && !bookmarksManager._getBookmarksScreenState()) {
            switch (this._getSettingsScreenState()) {
            case true:
                this._hideSettings();
                break;
            case false:
                this._showSettings();
                break;
            }
        }
    }
}

class ChatsManager {
    constructor() {
        this._chatsSreenState = false;
    }

    _showChats() {
        if (!this._getChatsScreenState()) {
            document.querySelector('.blur-block').style.zIndex = 101;
            $('.blur-block').animate({
                'opacity': '.90'
            }, ANIMATION_TIME);
            
            document.querySelector('.chats-wrapper').style.zIndex = 102;
            $('.chats-wrapper').animate({
                'top': '0'
            }, ANIMATION_TIME);

            this._chatsSreenState = true;
        }
    }

    _hideChats() {
        if (this._getChatsScreenState()) {
            if (NAME_EDITOR._isEditing())
            {
                NAME_EDITOR._cancelEditing();
            }

            $('.blur-block').animate({
                'opacity': 0
            }, ANIMATION_TIME, () => {
                document.querySelector('.blur-block').style.zIndex = -101;
            });
            
            $('.chats-wrapper').animate({
                'top': '-100%'
            }, ANIMATION_TIME, () => {
                document.querySelector('.chats-wrapper').style.zIndex = -102;
            });

            this._chatsSreenState = false;
        }
    }

    _getChatsScreenState() {
        return this._chatsSreenState;
    }

    /**
     * @param {SettingsManager} settingsManager 
     * @param {BookmarksManager} bookmarksManager  
     */
    _switchChatsScreenState(settingsManager, bookmarksManager) {
        if (!settingsManager._getSettingsScreenState() && !bookmarksManager._getBookmarksScreenState()) {
            switch (this._getChatsScreenState()) {
            case true:
                this._hideChats();
                break;
            case false:
                this._showChats();
                break;
            }
        }
    }
}

class InputBoxManager {
    constructor() {
        this._inputBoxState = false;
    }

    _showInputBox() {
        $('.chatgpt__search-box').css({ 'display': 'flex' });
        $('.chatgpt__search-box').animate({
            'opacity': '1'
        }, ANIMATION_TIME);

        this.inputBoxState = true;
    }

    _hideInputBox() {
        $('.chatgpt__search-box').animate({
            'opacity': '0'
        }, ANIMATION_TIME, () => {
            $('.chatgpt__search-box').css({ 'display': 'none' });
        });

        this.inputBoxState = false;
    }

    _getInputBoxState() {
        return this._inputBoxState;
    }
}

class BookmarksManager {
    constructor() {
        this._bookmarksScreenState = false;
    }

    _showBookmarks() {
        if (!this._getBookmarksScreenState()) {
            $('.bookmarks').css({
                'z-index': 102
            });
    
            $('.bookmarks').animate({
                opacity: 1
            }, ANIMATION_TIME);

            this._bookmarksScreenState = true;
        }
    }

    _hideBookmarks() {
        if (this._getBookmarksScreenState()) {
            $('.bookmarks').animate({
                opacity: 0
            }, ANIMATION_TIME, () => {
                $('.bookmarks').css({
                    'z-index': -102
                });

                this._bookmarksScreenState = false;
            });
        }
    }

    _getBookmarksScreenState() {
        return this._bookmarksScreenState;
    }

    /**
     * @param {ChatsManager} chatsManager 
     * @param {SettingsManager} settingsManager  
     */
    _switchBookmarksScreenState(chatsManager, settingsManager) {
        if (!chatsManager._getChatsScreenState() && !settingsManager._getSettingsScreenState()) {
            switch (this._getBookmarksScreenState()) {
            case true:
                return this._hideBookmarks();
            case false:
                return this._showBookmarks();
            }
        }
    }
}

class WelcomeScreenManager {
    constructor() {
        this._welcomeScreenState = true;
    }

    _showWelcomeScreen() {
        if (!this._getWelcomeScreenState()) {
            $('.chatgpt__welcome').css({
                'z-index': 0
            });
    
            $('.chatgpt__welcome').animate({
                opacity: 1
            }, ANIMATION_TIME);

            this._welcomeScreenState = true;
        }
    }

    _hideWelcomeScreen() {
        if (this._getWelcomeScreenState()) {
            $('.chatgpt__welcome').animate({
                opacity: 0
            }, ANIMATION_TIME, () => {
                $('.chatgpt__welcome').css({
                    'z-index': -1000
                });

                this._welcomeScreenState = false;
            });
        }
    }

    _getWelcomeScreenState() {
        return this._welcomeScreenState;
    }
}