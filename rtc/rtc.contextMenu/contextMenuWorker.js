class ContextMenuWorker {
    constructor() {
        this._contextMenuState = false;
    }

    _showContextMenu() {
        if (!this._getContextMenuState()) {
            $('.main-context-menu').css({
                'z-index': 1000,
                'display': 'flex'
            });

            this._contextMenuState = true;
        }
    }

    _hideContextMenu() {
        if (this._getContextMenuState()) {
            $('.main-context-menu').css({
                'z-index': -1000,
                'display': 'none'
            });

            this._contextMenuState = false;
        }
    }

    _getContextMenuState() {
        return this._contextMenuState;
    }

    _switchContextMenuState() {
        if (this._getContextMenuState()) {
            this._hideContextMenu();
        }
        else {
            this._showContextMenu();
        }
    }
}

class BookmarksContextMenuWorker {
    constructor() {
        this._contextMenuState = false;
    }

    _showContextMenu() {
        if (!this._getContextMenuState()) {
            $('.bookmarks-context-menu').css({
                'z-index': 1000,
                'display': 'flex'
            });

            this._contextMenuState = true;
        }
    }

    _hideContextMenu() {
        if (this._getContextMenuState()) {
            $('.bookmarks-context-menu').css({
                'z-index': -1000,
                'display': 'none'
            });

            this._contextMenuState = false;
        }
    }

    _getContextMenuState() {
        return this._contextMenuState;
    }

    _switchContextMenuState() {
        if (this._getContextMenuState()) {
            this._hideContextMenu();
        }
        else {
            this._showContextMenu();
        }
    }
}