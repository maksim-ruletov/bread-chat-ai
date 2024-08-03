class ActiveTokenManager {
    constructor() {
        this._activeToken = null;
        this._tokens = [];
    }

    _markActiveToken() {
        return api.ipcRenderer.invoke('get-active-token').then(response => {
            if (response) {
                document.querySelector(`[token-id="${response.tokenIndex}"]`).classList.add('active');
                this._activeToken = response.tokenIndex;
            }
        });
    }

    _collect() {
        document.querySelectorAll('[token-id]').forEach(item => {
            this._tokens.push(item);
        })
    }

    _addListeners() {
        this._tokens.forEach(item => {
            item.children[0].addEventListener('click', () => {
                this._changeActiveToken(item.getAttribute('token-id'));
            });
        });
    }

    _changeActiveToken(tokenIndex) {
        api.ipcRenderer.invoke('change-active-token', tokenIndex).then(response => {
            if (response.ok) {
                document.querySelector(`[token-id="${this._activeToken}"]`).classList.remove('active');
                this._activeToken = tokenIndex;
                document.querySelector(`[token-id="${this._activeToken}"]`).classList.add('active');
            }
            else {
                //
            }
        });
    }

    static deleteToken(tokenIndex) {
        api.ipcRenderer.invoke('delete-token', tokenIndex).then(response => {
            if (response.ok) {
                document.querySelector(`[token-id="${tokenIndex}"]`).remove();

                if (tokenIndex === this._activeToken)
                {
                    this._activeToken = null;
                }

                if (document.querySelector('.content__tokens-list').children.length === 0)
                {
                    wot_generate();
                    localizateWOT();
                    client._closeChat();
                }
                else
                {
                    TOKEN_MANAGER._clear();
                    TOKEN_MANAGER._collect();
                    TOKEN_MANAGER._markActiveToken();
                }
            }
        })
    }

    _clear()
    {
        this._tokens = [];
    }
}