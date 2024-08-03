class TokenParser {
    constructor() {
        this._tokens = [];
    }

    _getTokens() {
        return api.ipcRenderer.invoke('get-tokens').then(response => {
            if (response.length > 0) {
                response.forEach(item => {
                    document.querySelector('.content__tokens-list').innerHTML += `<div token-id="${item.tokenIndex}" class="tokens-list__item"><div class="item__name">${item.value[0]}${item.value[1]}${item.value[2]}${item.value[3]}${item.value[4]}${item.value[5]}${item.value[6]}&#8902&#8902&#8902&#8902&#8902&#8902&#8902&#8902&#8902&#8902&#8902&#8902&#8902</div><div onclick="ActiveTokenManager.deleteToken('${item.tokenIndex}')" class="item__delete" style="opacity: 0"><span class="fa-regular fa-trash awesome"></span></div></div>`
                    let element = document.querySelector(`[token-id="${item.tokenIndex}"]`);

                    this._tokens.push(element);
                    element = null;
                });

                this._applyTrashAnimations();
            }
        });
    }

    _applyTrashAnimations() {
        document.querySelectorAll('[token-id]').forEach(item => {
            $(item)
                .mouseenter(() => {
                    $(item.children[1]).animate({
                        'opacity': 1
                    }, ANIMATION_TIME);
                })
                .mouseleave(() => {
                    $(item.children[1]).animate({
                        'opacity': 0
                    }, ANIMATION_TIME);
                });
        })
    }
}