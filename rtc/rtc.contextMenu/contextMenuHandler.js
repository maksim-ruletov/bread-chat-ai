class ContextMenu {
    constructor() {
        this._focusedElement = null;
    }

    _addListeners() {
        document.querySelectorAll('.chat__answer').forEach(item => {
            item.children[0].addEventListener('mousedown', (event) => {
                if (event.which !== 3) {
                    return;
                }

                $('.main-context-menu').css({
                    'top': event.clientY,
                    'left': event.clientX
                });

                document.querySelector('.main-context-menu').children[0].onclick = () => {
                    if (window.getSelection)
                    {
                        navigator.clipboard.writeText(window.getSelection().toString());
                    }
                    else
                    {
                        navigator.clipboard.writeText(item.children[0].textContent);
                    }

                    CONTEXT_MENU_WORKER._hideContextMenu();
                }

                document.querySelector('.main-context-menu').children[1].onclick = () => {
                    api.ipcRenderer.invoke('bookmark-message', messages._get(item.getAttribute('message-id'))).then(response => {
                        if (response.ok) {
                            if (document.querySelector('.bookmarks__list > .no-bookmarks'))
                            {
                                document.querySelector('.bookmarks__list').innerHTML = '';
                            }

                            document.querySelector('.bookmarks__list').innerHTML += `
                                    <div message-id="${response.index}" class="list__bookmark">
                                        ${marked.parse(messages._get(item.getAttribute('message-id')))}
                                    </div>
                                    `;

                            CONTEXT_MENU._addBookmarksListeners();

                            document.querySelectorAll(`[message-id="${response.index}"] > pre`).forEach(n_item => {
                                let t_code = n_item.children[0];
                                let t_language = t_code.getAttribute('class').split('-')[1];
                            
                                const highlightedCode = hljs.highlight(
                                    t_code.textContent,
                                    { language: t_language }
                                ).value
    
                                t_code.innerHTML = highlightedCode;
                            });
                        }
                    });

                    CONTEXT_MENU_WORKER._hideContextMenu();
                }

                document.querySelector('.chatgpt__chat').addEventListener('click', () => {
                    if (CONTEXT_MENU_WORKER._getContextMenuState())
                    {
                        CONTEXT_MENU_WORKER._hideContextMenu();
                    }
                });

                if (item != CONTEXT_MENU._focusedElement) {
                    CONTEXT_MENU._focusedElement = item;

                    if (!CONTEXT_MENU_WORKER._getContextMenuState()) {
                        CONTEXT_MENU_WORKER._showContextMenu();
                    }
                }
                else {
                    CONTEXT_MENU_WORKER._switchContextMenuState();
                }
            });
        });
    }

    _addBookmarksListeners() {
        document.querySelectorAll('.list__bookmark').forEach(item => {
            item.addEventListener('mousedown', (event) => {
                if (event.which !== 3) {
                    return;
                }

                $('.bookmarks-context-menu').css({
                    'top': event.clientY,
                    'left': event.clientX
                });

                document.querySelector('.bookmarks-context-menu').children[0].onclick = () => {
                    navigator.clipboard.writeText(item.children[0].textContent);

                    BOOKMARKS_CONTEXT_MANAGER._hideContextMenu();
                }

                document.querySelector('.bookmarks-context-menu').children[1].onclick = () => {
                    api.ipcRenderer.invoke('remove-bookmark', item.getAttribute('message-id')).then(response => {
                        if (response.ok) {
                            item.remove();

                            if (document.querySelector('.bookmarks__list').children.length === 0)
                            {
                                document.querySelector('.bookmarks__list').innerHTML = 
                                `
                                <div class="no-bookmarks">
                                    <span translate="bookmarks.zero"></span>
                                </div>
                                `;

                                localizateZB();
                            }
                        }
                    })

                    BOOKMARKS_CONTEXT_MANAGER._hideContextMenu();
                }

                document.querySelector('.bookmarks__list').addEventListener('click', () => {
                    if (BOOKMARKS_CONTEXT_MANAGER._getContextMenuState())
                    {
                        BOOKMARKS_CONTEXT_MANAGER._hideContextMenu();
                    }
                });

                if (item != CONTEXT_MENU._focusedElement) {
                    CONTEXT_MENU._focusedElement = item;

                    if (!BOOKMARKS_CONTEXT_MANAGER._getContextMenuState()) {
                        BOOKMARKS_CONTEXT_MANAGER._showContextMenu();
                    }
                }
                else {
                    BOOKMARKS_CONTEXT_MANAGER._switchContextMenuState();
                }
            });
        });
    }
}