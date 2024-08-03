class Hotkey {
    /**
     * @param {object} modifiers 
     * @param {number} key 
     * @param {"and"|"or"} compareMode 
     */
    constructor(modifiers, key, compareMode = "or") {
        this.modifiers = modifiers;
        this.key = key;
        this.compareMode = compareMode;
    }

    /**
     * Compare Hotkey with target
     * 
     * @param {EventTarget} event 
     * @returns {boolean}
     */
    Compare(event) {
        const MODIFIERS = ['ctrlKey', 'shiftKey', 'metaKey', 'altKey'];
        let foundModifiers = {};

        MODIFIERS.forEach(item => {
            if (this.modifiers[item]) {
                foundModifiers[item] = event[item];
            }
        });

        let foundKey = event.keyCode;

        if (this.compareMode === 'and') {
            return (Object.values(foundModifiers).length > 0 ? objectsEqual(this.modifiers, foundModifiers) : true) && foundKey === this.key;
        }
        
        return (Object.values(foundModifiers).length > 0 ? OneFieldIsTrue(foundModifiers) : true) && foundKey === this.key;
    }
}

class HotkeyListener {
    static _closeHotkeyListener() {
        HOTKEY_CHANGER._clean();

        BlurBoxManager._hideBlurBox();
        SettingsHotkeyListenerPopup._hidePopup();

        hotkeyStore._blockHotkey(registerHotkeys.find(item => item.name === 'listen-hotkey').index);
        hotkeyStore._unblockHotkey(registerHotkeys.find(item => item.name === 'close-active-content').index);

        document.querySelector('.hotkey__submit-button').removeEventListener('click', finishHotkeyRegister, false);
        document.querySelector('.popup__hotkeys-output').textContent = '';
        document.querySelector('.hotkey__submit-button').classList.remove('hover');
        document.querySelector('.hotkey__submit-button').style.cursor = 'not-allowed';
    }

    static _changeControlHotkey() {
        BlurBoxManager._showBlurBox();
        SettingsHotkeyListenerPopup._showPopup();
        
        hotkeyStore._unblockHotkey(registerHotkeys.find(item => item.name === 'listen-hotkey').index);
        hotkeyStore._blockHotkey(registerHotkeys.find(item => item.name === 'close-active-content').index);
    }

    static resetToDefault() {
        api.ipcRenderer.invoke('@system::hotkeys::main::reset').then(() => {
            api.ipcRenderer.invoke('get-hotkey').then(response => document.querySelector('.hotkey__entry').innerHTML = `<span>${response}</span>`);
        });
    }
}