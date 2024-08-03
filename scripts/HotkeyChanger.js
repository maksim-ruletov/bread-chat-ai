class HotkeyChanger {
    constructor() {
        this.modifiers = {};
        this.key = null;
    }

    _register(modifiers) {
        Object.keys(modifiers).forEach(item => {
            if (modifiers[item] && !this.modifiers[item]) {
                this.modifiers[item] = true;
            }
        });
    }

    _complete(key) {
        this.key = key;
    }

    _serialize() {
        let output = ``;
        let modifiersKeys = Object.keys(this.modifiers);
        let modifiersNames = {
            'ctrlKey': 'Control',
            'shiftKey': 'Shift',
            'altKey': 'Alt'
        }

        modifiersKeys.forEach((item, index) => {
            output += modifiersNames[item] + (modifiersKeys[index + 1] ? ' + ' : '');
        })

        if (this.key) {
            output += `${Object.keys(this.modifiers).length > 0 ? ' +' : ''} ${this.key.toUpperCase()}`;
        }

        return output;
    }

    _finalize() {
        if (!this.key && Object.key(this.modifiers).length < 1) {
            return console.log(`Could not register empty hotkey`);
        }

        
        let response = api.ipcRenderer.invoke('change-hotkey', this._serialize());

        return response;
    }

    _clean() {
        this.modifiers = {};
        this.key = null;
    }
}