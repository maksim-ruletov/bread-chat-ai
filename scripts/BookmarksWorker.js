class BookmarksWorker {
    static LoadBookmarks() {
        api.ipcRenderer.invoke('get-bookmarks').then(response => {
            if (response.length > 0) {
                response.forEach((item, index) => {
                    document.querySelector('.bookmarks__list').innerHTML += `
                    <div message-id="${index}" class="list__bookmark">
                        ${marked.parse(item)}
                    </div>
                    `;

                    document.querySelectorAll(`[message-id="${index}"] > pre`).forEach((n_item) => {
                        let t_code = n_item.children[0];
                        let t_language = t_code.getAttribute('class').split('-')[1];
                    
                        const highlightedCode = hljs.highlight(
                            t_code.textContent,
                            { language: t_language }
                        ).value;
    
                        t_code.innerHTML = highlightedCode;
                    });
                });

                CONTEXT_MENU._addBookmarksListeners();
            }
            else
            {
                document.querySelector('.bookmarks__list').innerHTML = 
                `
                <div class="no-bookmarks">
                    <span translate="bookmarks.zero"></span>
                </div>
                `;

                localizateZB();
            }
        });
    }
}