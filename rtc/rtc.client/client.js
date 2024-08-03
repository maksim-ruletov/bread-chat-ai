class Client
{
    constructor()
    {
        this._errors = [];
        this._waitingResponse = false;
        this._activeChat;
    }

    // a_message [Message]
    _sendMessage(a_message)
    {
        if (!a_message instanceof Message)
        {
            Note.createNote(api.localisation[api.getConfig().language]['errors.cant-send-message'], 1500);
            return /* error log here */;
        }

        // Normilize message to send it
        let t_messageObject = a_message._normalize();

        this._waitingResponse = true;

        return api.ipcRenderer.invoke('@chatgpt3.5::send_message', t_messageObject)
    }

    _checkWaitingResponse() 
    {
        return this._waitingResponse;
    }

    _stopWaiting()
    {
        this._waitingResponse = false;
    }

    _readChat(a_chatId)
    {
        this._activeChat = a_chatId;

        api.ipcRenderer.invoke('@system::chats::read', a_chatId).then(response => {
            if (response.OK)
            {
                WELCOME_SCREEN_MANAGER._hideWelcomeScreen();

                $('.chatgpt__chat').html('');

                response = response.CHAT;

                client._activeChat = response._chatId;
                parseAndStream(response._chatMessages);
                CONTEXT_MENU._addListeners();

                $('.menu__current-chat-name').text(response._chatName);

                INPUT_BOX_MANAGER._showInputBox();
                MENU_CONTROL_BUTTON._hideControlButton();
                CHATS_MANAGER._hideChats();

                document.querySelector('.search-box__input').focus();
            }
        });
    }

    _getChats()
    {
        return api.ipcRenderer.invoke('@system::chats::getAll');
    }

    _deleteChat(a_chatId)
    {
        api.ipcRenderer.invoke('@system::chats::delete', a_chatId).then(n_response => {
            if (n_response.OK && this._activeChat === a_chatId)
            {
                this._closeChat();
            }
        })
    }

    _renameChat(a_chatId)
    {
        let t_element = document.querySelector(`[chat-id="${a_chatId}"]`);

        NAME_EDITOR._startEditing(t_element);
    }

    _getActiveChat()
    {
        return this._activeChat;
    }

    _requsetToAI(a_chatId)
    {
        api.ipcRenderer.invoke('@system::ai::sendMessage', a_chatId);

        let t_responseModel = buildElement(
            'div',
            '',
            {
                'class': 'chat__answer',
                'message-id': messages._getLastElement() ? Number(messages._getLastElement()) + 1 : 0
            },
            [
                buildElement(
                    'div',
                    '',
                    {
                        'class': 'answer__text-wrapper'
                    }
                )
            ]
        )

        api.on('chatgpt:stream', (event, words) => {
            t_responseModel.children[0].innerHTML = marked.parse(words);
            messages._push(messages._getLastElement() ? Number(messages._getLastElement()) + 1 : 0, words);

            document.querySelector('.chatgpt__chat').insertBefore(t_responseModel, document.querySelector('.chatgpt__chat').children[0]);
            document.querySelector('.search-box__send > span').classList.add('fa-paper-plane-top');
            document.querySelector('.search-box__send > span').classList.remove('fa-circle-notch', 'fa-spin');

            t_responseModel.children[0].childNodes.forEach(t_item => {
                if (t_item.nodeName === 'PRE')
                {
                    let t_code = t_item.children[0];
                    let t_language = t_code.getAttribute('class').split('-')[1];

                    const highlightedCode = hljs.highlight(
                        t_code.textContent,
                        { language: t_language }
                    ).value

                    t_code.innerHTML = highlightedCode;
                }
            });

            CONTEXT_MENU._addListeners();
            document.querySelector('.search-box__input').disabled = false;
            document.querySelector('.search-box__input').focus();
        });

        api.on('chatgpt:stream:stop', (event) => {
            api.removeAll('chatgpt:stream');
            api.removeAll('chatgpt:stream:stop');
        })
    }

    _clearChatsList()
    {
        $('.chats-wrapper__list').html('');
    }

    _createChat()
    {
        api.ipcRenderer.invoke('@system::chats::create', api.localisation[api.getConfig().language]['templates.chat-name']).then(t_response => {
            if (!t_response.OK)
            {
                return Note.createNote(api.localisation[api.getConfig().language]['errors.cant-create-chat'], 1500);
            }
            else
            {
                this._clearChatsList();
                requestChats();
            }
        });
    }

    _clearChat()
    {
        $('.chatgpt__chat').html('');
    }

    _openChat(a_chatId)
    {
        if (this._waitingResponse)
        {
            return Note.createNote(api.localisation[api.getConfig().language]['errors.please-wait'], 1500);
        }

        if (NAME_EDITOR._isEditing())
        {
            return Note.createNote(api.localisation[api.getConfig().language]['errors.cant-open-chat'], 1500);
        }

        this._readChat(a_chatId);
    }

    _resetContext()
    {
        if (this._waitingResponse)
        {
            return Note.createNote(api.localisation[api.getConfig().language]['errors.please-wait'], 1500);
        }

        CONTEXT_MENU_WORKER._hideContextMenu();

        api.ipcRenderer.invoke('@system::chats::reset', this._activeChat).then(t_response => {
            if (t_response.OK)
            {
                $('.chatgpt__chat').html('');
            }
        })
    }

    _closeChat()
    {
        if (!this._waitingResponse && this._activeChat)
        {
            this._activeChat = null;

            document.querySelector('.menu__current-chat-name').textContent = '';
            document.querySelector('.chatgpt__chat').innerHTML = '';

            INPUT_BOX_MANAGER._hideInputBox();
            WELCOME_SCREEN_MANAGER._showWelcomeScreen();
            MENU_CONTROL_BUTTON._showControlButton();
        }
    }
}