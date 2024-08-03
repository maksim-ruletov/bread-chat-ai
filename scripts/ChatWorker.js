class ChatWorker {
    constructor() {
        this._activeChat = null;
        this._defaultName = { 'en': 'New chat','ru': 'Новый чат' }[api.config.language];
    }

    _createChat() {
        api.ipcRenderer.invoke('create-chat', this._defaultName).then(response => {
            let chatData = response.chatData;

            if (response.ok) {
                document.querySelector('.chats-wrapper__list').innerHTML += `<div class="list__item" chat-id="${chatData.chatId}"><span onclick="CHAT_WORKER._openChat('${chatData.chatId}')" class="item__name">${chatData.chatName}</span><button onclick="RenameChat('${chatData.chatId}')" class="item__rename"><span class="fa-regular fa-pen awesome"></span></button><button onclick="CHAT_WORKER._deleteChat('${chatData.chatId}')" class="item__delete"><span class="fa-regular fa-xmark awesome"></span></button></div>`
            }

            if (document.querySelector('.chats-wrapper__list').children.length > 7) {
                document.querySelector('.chats-wrapper__list').style.overflowY = 'scroll';
            }

            ApplyAnimation();

            this._openChat(chatData.chatId);
        });
    }

    _loadChats() {
        api.ipcRenderer.invoke('get-chats').then(response => {
            let parsedResponse = JSON.parse(response);

            if (parsedResponse.length > 0) {
                if (parsedResponse.length > 7) {
                    document.querySelector('.chats-wrapper__list').style.overflowY = 'scroll';
                }

                parsedResponse.forEach(item => {
                    document.querySelector('.chats-wrapper__list').innerHTML += `<div class="list__item" chat-id="${item.chatId}"><span onclick="CHAT_WORKER._openChat('${item.chatId}')" class="item__name">${item.chatName}</span><button onclick="CHAT_WORKER._renameChat('${item.chatId}')" class="item__rename"><span class="fa-regular fa-pen awesome"></span></button><button onclick="CHAT_WORKER._deleteChat('${item.chatId}')" class="item__delete"><span class="fa-regular fa-xmark awesome"></span></button></div>`;
                });

                ApplyAnimation();
            }
        })
    }

    _openChat(chatId) {
        CHATS_MANAGER._hideChats();
        WELCOME_SCREEN_MANAGER._hideWelcomeScreen();

        if (!INPUT_BOX_MANAGER._getInputBoxState()) {
            INPUT_BOX_MANAGER._showInputBox();
        }

        this._clearChatsList();

        MENU_CONTROL_BUTTON._hideControlButton();

        api.ipcRenderer.invoke('read-chat', chatId).then(response => {
            const parsedResponse = JSON.parse(response);

            this._setActiveChat(parsedResponse.chatId, parsedResponse.chatName);

            if (parsedResponse) {
                if (parsedResponse.messages.length > 0) {
                    parsedResponse.messages.forEach(item => {
                        document.querySelector('.chatgpt__chat').innerHTML = `<div class="chat__${item.type}"><div class="${item.type}__text-wrapper">${item.message}</div></div>${document.querySelector('.chatgpt__chat').innerHTML}`;
                    });
                    CONTEXT_MENU._addListeners();
                }
            }

            document.querySelector('.search-box__input').focus();
        })
    }

    _clearChatsList() {
        document.querySelector('.chatgpt__chat').innerHTML = "";
    }

    _setActiveChat(chatId, chatName) {
        document.querySelector('.menu__current-chat-name').textContent = chatName;
        document.querySelector('.menu__current-chat-name').setAttribute(`current-id`, chatId);

        this._activeChat = chatId;
    }

    _removeActiveChat() {
        document.querySelector('.menu__current-chat-name').removeAttribute('chat-id');
        document.querySelector('.menu__current-chat-name').textContent = '';

        this._activeChat = null;
    }

    _deleteChat(chatId) {
        api.ipcRenderer.invoke('delete-chat', chatId).then(response => {
            const parsedResponse = JSON.parse(response);

            if (parsedResponse.ok) {
                document.querySelector(`[chat-id="${chatId}"]`).remove();

                if (chatId === this._activeChat) {
                    this._closeActiveChat();
                }
            }
        })
    }

    _autoOpenFirstChat() {
        if (api.config['open-first-chat']) {
            this._openChat('first', CHATS_MANAGER, WELCOME_SCREEN_MANAGER, INPUT_BOX_MANAGER);
        }
    }

    _hasActiveChat() {
        return this._activeChat ? true : false;
    }

    _closeActiveChat() {
        if (this._hasActiveChat()) {
            INPUT_BOX_MANAGER._hideInputBox();

            this._removeActiveChat();
            this._clearChatsList();

            WELCOME_SCREEN_MANAGER._showWelcomeScreen();
            MENU_CONTROL_BUTTON._showControlButton();
        }
    }

    _getActiveChat() {
        return this._activeChat;
    }

    _renameChat(chatId) {
        let t_element = document.querySelector(`[chat-id="${chatId}"]`);

        NAME_EDITOR._startEditing(t_element);
    }
}