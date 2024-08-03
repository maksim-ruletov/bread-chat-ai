TOKENS._getTokens().then(() => {
    TOKEN_MANAGER._collect();
    TOKEN_MANAGER._addListeners();
    TOKEN_MANAGER._markActiveToken().then(() => {
        if (TOKEN_MANAGER._activeToken) {
            requestChats();

            MENU_CONTROL_BUTTON._loadWT();

            if (api.getConfig()['open-first-chat']) {
                client._readChat('first');
            }
            else {
                MENU_CONTROL_BUTTON._showControlButton();
            }
        }
        else {
            MENU_CONTROL_BUTTON._loadWOT();

            document.querySelector('#open-chat').disabled = true;
            document.querySelector('#open-chat').style.cursor = 'not-allowed';

            wot_generate();
            localizateWOT();
        
            MENU_CONTROL_BUTTON._showControlButton();
        }
    });
});

ADD_TOKEN_HANDLER._collect();
ADD_TOKEN_HANDLER._addListeners();

if (api.config['checked-tutorial']) {
    initialize();
}
else {
    ALLOCATOR._allocate(`Tutorial`, new Tutorial());
    ALLOCATOR._fetch(`Tutorial`)._createAndAppend();
    ALLOCATOR._deallocateByName(`Tutorial`);
    startTutorial();
}

function startTutorial() {
    document.querySelector('.tutorial').style.display = 'flex';
    document.querySelector('.tutorial').style.zIndex = 102;

    document.querySelector('.blur-block').style.opacity = '1';
    document.querySelector('.blur-block').style.zIndex = 101;
}

translateAll();

ALLOCATOR._allocate(`SettingsHotkeyList`, new SettingsHotkeyList());
ALLOCATOR._fetch(`SettingsHotkeyList`)._createAndAppend().then(() => {
    translateSettings();
})
ALLOCATOR._deallocateByName(`SettingsHotkeyList`);

function initialize() {
    registerHotkeys.push({
        'name': 'open-settings',
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true, metaKey: true }, 188, 'or'), (event) => {
            if (NAME_EDITOR._isEditing())
            {
                NAME_EDITOR._cancelEditing();
            }

            SETTINGS_MANAGER._switchSettingsScreenState(CHATS_MANAGER, BOOKMARKS_MANAGER);
            CONTEXT_MENU_WORKER._hideContextMenu();
        })
    });

    registerHotkeys.push({
        'name': 'open-chats',
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true, metaKey: true }, 83, 'or'), (event) => {
            CHATS_MANAGER._switchChatsScreenState(SETTINGS_MANAGER, BOOKMARKS_MANAGER);
            CONTEXT_MENU_WORKER._hideContextMenu();
        })
    });

    registerHotkeys.push({
        'name': `open-bookmarks`,
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true, metaKey: true }, 68, 'or'), (event) => {
            if (NAME_EDITOR._isEditing())
            {
                NAME_EDITOR._cancelEditing();
            }

            BOOKMARKS_MANAGER._switchBookmarksScreenState(CHATS_MANAGER, SETTINGS_MANAGER);
            CONTEXT_MENU_WORKER._hideContextMenu();
        })
    });

    registerHotkeys.push({
        'name': `close-active-content`,
        'index': hotkeyStore.StoreHotkey(new Hotkey({}, 27), (event) => {
            if (NAME_EDITOR._isEditing())
            {
                NAME_EDITOR._cancelEditing();
            }

            switch(WhatIsCurrentOpened()) {
            case 'settings':
                if (ADD_TOKEN_POPUP._getPopupState()) {
                    ADD_TOKEN_POPUP._hidePopup();
                }
                else {
                    SETTINGS_MANAGER._hideSettings();
                }

                break;
            case 'chats':
                CHATS_MANAGER._hideChats();
                break;
            case 'bookmarks':
                BOOKMARKS_MANAGER._hideBookmarks();
                break;
            }
        })
    });

    registerHotkeys.push({
        'name': `listen-hotkey`,
        'index': hotkeyStore.StoreHotkey('*', (event) => {
            let restrictedKeys = [17, 16, 91, 18, 9, 20, 27, 13, 8];
            let englishAlphabet = ['q', 'e', 'y', 'u', 'i', 'o', 'p', 'a', 'g', 'h', 'j', 'k', 'z',
                                   'b', 'n', 'm', '\'', '"', '[', ']', ';', '.', '/', 'space'];
            let currentKeyCode = event.keyCode;

            if (restrictedKeys.includes(currentKeyCode)) {
                currentKeyCode = null;
            }

            if (currentKeyCode && !englishAlphabet.includes(event.key.toLowerCase())) {
                Note.createNote(api.localisation[api.config.language]['errors.hotkeys.hey-is-restricted'], 1500);
                currentKeyCode = null;
            }

            let modifiers = {
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey
            };

            if (currentKeyCode) {
                HOTKEY_CHANGER._complete(event.key);

                document.querySelector('.popup__hotkeys-output').textContent = HOTKEY_CHANGER._serialize();

                hotkeyStore._blockHotkey(registerHotkeys.find(item => item.name === 'listen-hotkey').index);

                document.querySelector('.hotkey__submit-button').addEventListener('click', finishHotkeyRegister, false);
                document.querySelector('.hotkey__submit-button').style.cursor = 'pointer';
                document.querySelector('.hotkey__submit-button').classList.add('hover');
            }
            else {
                HOTKEY_CHANGER._register(modifiers);
                document.querySelector('.popup__hotkeys-output').textContent = HOTKEY_CHANGER._serialize();
            }
        })
    });

    registerHotkeys.push({
        'name': `reset-context`,
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true }, 69), (event) => {
            if (client._checkWaitingResponse())
            {
                return Note.createNote(api.localisation[api.getConfig().language]['errors.please-wait'], 1500);
            }

            client._resetContext();
            document.querySelector('.search-box__input').disabled = false;
            CONTEXT_MENU_WORKER._hideContextMenu();
        })
    });

    registerHotkeys.push({
        'name': `create-chat`,
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true }, 84), (event) => {
            if (NAME_EDITOR._isEditing())
            {
                NAME_EDITOR._cancelEditing();
            }

            if (CHATS_MANAGER._getChatsScreenState()) {
                client._createChat();
            }
        })
    });

    registerHotkeys.push({
        'name': `delete-chat`,
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true }, 87), (event) => {
            if (NAME_EDITOR._isEditing())
            {
                NAME_EDITOR._cancelEditing();
            }

            if (CHAT_WORKER._hasActiveChat()) {
                client._deleteChat(client._getActiveChat());
            }
            else {
                if (document.querySelector('.chats-wrapper__list').children.length > 0) {
                    let t_index = document.querySelector('.chats-wrapper__list').children.length - 1;
                    let t_lastChat = document.querySelector('.chats-wrapper__list').children[t_index].getAttribute('chat-id');

                    client._deleteChat(t_lastChat);
                    requestChats();
                    messages._clear();
                }
            }
        })
    });

    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(item => {
        registerHotkeys.push({
            'name': `open-${item}-chat`,
            'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true }, 49 + item), (event) => {
                if (NAME_EDITOR._isEditing())
                {
                    NAME_EDITOR._cancelEditing();
                }

                if (client._checkWaitingResponse())
                {
                    return Note.createNote(api.localisation[api.getConfig().language]['errors.please-wait'], 1500);
                }

                if (!SETTINGS_MANAGER._getSettingsScreenState() && !BOOKMARKS_MANAGER._getBookmarksScreenState()) {
                    if (document.querySelector('.chats-wrapper__list').children[item]) {
                        client._openChat(document.querySelector('.chats-wrapper__list').children[item].getAttribute('chat-id'));

                        if (CHATS_MANAGER._getChatsScreenState()) {
                            CHATS_MANAGER._hideChats();
                        }

                        CONTEXT_MENU_WORKER._hideContextMenu();
                    }
                }
            })
        })
    });

    registerHotkeys.push({
        'name': `copy-last-message`,
        'index': hotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true }, 70), (event) => {
            if (client._getActiveChat()) {
                if (document.querySelector('.chatgpt__chat').children.length > 0 && document.querySelector('.chatgpt__chat').children[0].classList.contains('chat__answer')) {
                    navigator.clipboard.writeText(document.querySelector('.chatgpt__chat').children[0].children[0].textContent);
                    CONTEXT_MENU_WORKER._hideContextMenu();
                }
            }
        })
    });

    registerHotkeys.push({
        'name': 'send-message',
        'index': hotkeyStore.StoreHotkey('*', (event) => {
            if (event.keyCode === 13)
            {
                if (document.activeElement === document.querySelector('.search-box__input'))
                {
                    if (document.querySelector('.search-box__input').value.length > 0)
                    {
                        if (client._checkWaitingResponse())
                        {
                            return Note.createNote(api.localisation[api.getConfig().language]['errors.please-wait'], 1500);
                        }

                        let t_message = $('.search-box__input').val();
                        $('.search-box__input').val('');

                        sendMessage(t_message);
                    }
                }
                else if (document.activeElement.classList.contains('item__name'))
                {
                    NAME_EDITOR._finishEditing();
                }
            }
        })
    })

    hotkeyStore._blockHotkey(registerHotkeys.find(item => item.name === 'listen-hotkey').index);

    hotkeyStore.StartListeningHotkeys();
}

function finishHotkeyRegister() {
    HOTKEY_CHANGER._finalize().then(response => {
        if (response['ok']) {
            document.querySelector('.hotkey__entry > span').textContent = HOTKEY_CHANGER._serialize();

            HOTKEY_CHANGER._clean();

            BlurBoxManager._hideBlurBox();
            SettingsHotkeyListenerPopup._hidePopup();

            document.querySelector('.popup__hotkeys-output').textContent = '';

            hotkeyStore._blockHotkey(registerHotkeys.find(item => item.name === 'listen-hotkey').index);
            hotkeyStore._unblockHotkey(registerHotkeys.find(item => item.name === 'close-active-content').index);

            document.querySelector('.hotkey__submit-button').classList.remove('hover');
            document.querySelector('.hotkey__submit-button').removeEventListener('click', finishHotkeyRegister, false);
        }
    });
}

ThemeManager.LoadActiveTheme();
ThemeManager.LoadSwitchers();

LanguageManager.LoadActiveLanguage();
LanguageManager.LoadSwitchers();

BookmarksWorker.LoadBookmarks();

/* Выпадающее меню */
const languageDropDown = new DropDownMenu(document.querySelector('[modifier="language"]'), document.querySelector('#language-dropdown-list'));
const themeDropDown = new DropDownMenu(document.querySelector('[modifier="theme"]'), document.querySelector('#theme-dropdown-list'));
const serviceDropDown = new DropDownMenu(document.querySelector('[modifier="service"]'), document.querySelector('#service-dropdown-list'));

languageDropDown.CreateClickEvent();
themeDropDown.CreateClickEvent();
serviceDropDown.CreateClickEvent();

/* Переключение настроек */
let activeSettingsPage = 'general';

function AppendCurrentActivePage(newActivePage) {
    document.querySelector(`#${activeSettingsPage}`).classList.remove('selected');

    $(`#${activeSettingsPage}-content`).animate({
        opacity: 0
    }, ANIMATION_TIME, () => {
        document.querySelector(`#${activeSettingsPage}-content`).style.display = 'none';

        activeSettingsPage = newActivePage;

        document.querySelector(`#${newActivePage}`).classList.add('selected');
        document.querySelector(`#${newActivePage}-content`).style.display = 'block';
        $(`#${newActivePage}-content`).animate({
            opacity: 1
        }, ANIMATION_TIME);
    });
}

AppendCurrentActivePage('general');

document.querySelectorAll('.settings__selector-item').forEach(item => {
    item.addEventListener('click', () => {
        if (activeSettingsPage != item.id) {
            AppendCurrentActivePage(item.id);
        }
    })
});

/* Попап */
document.querySelector('#decline').addEventListener('click', () => {
    $('.settings__change-popup').animate({
        opacity: 0
    }, ANIMATION_TIME, () => {
        $('.settings__change-popup').css({
            zIndex: -102
        });
        
        $('.blur-block-2').css({
            zIndex: -101
        });
    });
});

function ApplyAppeare(item) {
    $(item)
        .mouseenter(() => {
            if (!NAME_EDITOR._isEditing()) {
                $(item.children[1]).animate({
                    'opacity': 1
                }, ANIMATION_TIME);
                $(item.children[2]).animate({
                    'opacity': 1
                }, ANIMATION_TIME);
            }
        })
        .mouseleave(() => {
            if (!NAME_EDITOR._isEditing()) {
                $(item.children[1]).animate({
                    'opacity': 0
                }, ANIMATION_TIME);
                $(item.children[2]).animate({
                    'opacity': 0
                }, ANIMATION_TIME);
            }
        });
}

function ApplyAnimation() {
    document.querySelectorAll('.list__item').forEach(item => {
        ApplyAppeare(item);
    });
}

ApplyAnimation();

function requestChats()
{
    document.querySelector('.chats-wrapper__list').innerHTML = '';

    client._getChats().then((a_response) => {
        if (a_response.OK)
        {
            a_response = a_response.CHATS;

            if (a_response.length > 7)
            {
                $('.chats-wrapper__list').css({
                    'overflowY': 'scroll'
                });
            }

            a_response.forEach(t_chat => {
                document.querySelector('.chats-wrapper__list').append(buildElement(
                    'div',
                    '',
                    {
                        'class': 'list__item',
                        'chat-id': t_chat.ID
                    },
                    [
                        buildElement(
                            'span',
                            t_chat.NAME,
                            {
                                'onclick': `client._readChat('${t_chat.ID}')`,
                                'class': 'item__name'
                            }
                        ),
                        buildElement(
                            'button',
                            '',
                            {
                                'onclick': `client._renameChat('${t_chat.ID}')`,
                                'class': 'item__rename'
                            },
                            [
                                buildElement(
                                    'span',
                                    '',
                                    {
                                        'class': 'fa-regular fa-pen awesome'
                                    }
                                )
                            ]
                        ),
                        buildElement(
                            'button',
                            '',
                            {
                                'class': 'item__delete',
                                'onclick': `client._deleteChat('${t_chat.ID}'); messages._clear(); requestChats();`
                            },
                            [
                                buildElement(
                                    'span',
                                    '',
                                    {
                                        'class': 'fa-regular fa-xmark awesome'
                                    }
                                )
                            ]
                        )
                    ]
                ))
            });

            ApplyAnimation();
        }
    });
}

function sendMessage(t_message)
{
    document.querySelector('.chatgpt__chat').scrollTo(0, document.querySelector('.chatgpt__chat').scrollHeight);

    client._sendMessage(new Message(t_message)).then(response => {
        if (!response.OK)
        {
            Note.createNote(`Code: ${response.ERROR}`, 1500);
        }
        else
        {
            $('.chatgpt__chat').html(`<div class="chat__question"><div class="question__text-wrapper">${t_message}</div></div>${$('.chatgpt__chat').html()}`);
            messages._push(messages._getLastElement() ? Number(messages._getLastElement()) + 1 : 0, t_message);
            document.querySelector('.search-box__input').disabled = true;
            document.querySelector('.search-box__send > span').classList.remove('fa-paper-plane-top');
            document.querySelector('.search-box__send > span').classList.add('fa-circle-notch', 'fa-spin');

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

            client._requsetToAI(client._getActiveChat());
            client._stopWaiting();
        }
    });
}