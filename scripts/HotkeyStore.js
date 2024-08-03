class HotkeyStore {
    /**
     * @param {Element} hotkeyListener 
     */
    constructor() {
        this.store = [];
    }

    /**
     * Store hoteky and handler for it
     * 
     * @param {Hotkey} hotkey
     * @param {Function} hotkeyEventHandler 
     * @returns {number}
     * 
     * ```js
     * HotkeyStore.StoreHotkey(new Hotkey({ ctrlKey: true }, 'A'), (event) => {
     *  console.log('Hotkey handled');
     * });
     * ```
     */
    StoreHotkey(hotkey, hotkeyEventHandler) {
        if (!hotkey || (!hotkey instanceof Hotkey && hotkey !== '*')) {
            return console.error('hotkey not found or incorrect!');
        }

        if (!hotkeyEventHandler || typeof hotkeyEventHandler !== 'function') {
            return console.error('hotkeyhandler not found or incorrect!');
        }

        this.store.push({
            hotkey,
            hotkeyEventHandler,
            /**
             * if you need to stop listening one hotkey to start
             * listening another hotkey, block it.
             */
            blocked: false
        });

        /**
         * You can save index
         */
        return this.store.length - 1;
    }

    /**
     * Start listening all dynamic hotkeys in store
     */
    StartListeningHotkeys() {
        document.body.addEventListener('keydown', (event) => {
            this.store.forEach(item => {
                if (!item.blocked) {
                    if (item.hotkey === '*') {
                        item.hotkeyEventHandler(event);
                    }
                    else {
                        if (item.hotkey.Compare(event)) {
                            item.hotkeyEventHandler(event);
                        }
                    }
                }
            });
        });
    }

    /**
     * Block any hotkey
     * 
     * @param {number} hotkeyIndex 
     */
    _blockHotkey(hotkeyIndex) {
        if (!hotkeyIndex || typeof hotkeyIndex !== 'number') {
            return console.error('hotkeyIndex not found or incorrect');
        }

        if (hotkeyIndex < 0 || hotkeyIndex > this.store.length - 1) {
            return console.error('hotkeyIndex out of range');
        }

        this.store[hotkeyIndex].blocked = true;
    }

    /**
     * Unblock any hotkey
     * 
     * @param {number} hotkeyIndex 
     */
    _unblockHotkey(hotkeyIndex) {
        if (!hotkeyIndex || typeof hotkeyIndex !== 'number') {
            return console.error('hotkeyIndex not found or incorrect');
        }

        if (hotkeyIndex < 0 || hotkeyIndex > this.store.length - 1) {
            return console.error('hotkeyIndex out of range');
        }

        this.store[hotkeyIndex].blocked = false;
    }
}