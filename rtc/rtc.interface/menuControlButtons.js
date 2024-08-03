class ControlButton {
    constructor() {
        this._buttonState = false;
    }

    _loadWOT()
    {
        document.querySelector('#control-button').textContent = api.localisation[api.getConfig().language]['app.control-button.without-token'];
        document.querySelector('#control-button').onclick = () => {
            SETTINGS_MANAGER._showSettings();
            AppendCurrentActivePage('chatgpt');
        };
    }

    _loadWT()
    {
        document.querySelector('#control-button').textContent = api.localisation[api.getConfig().language]['app.control-button.with-token'];
        document.querySelector('#control-button').onclick = () => {
            CHATS_MANAGER._showChats();
        };
    }

    _showControlButton() {
        if (!this._getControlButtonState()) {
            $('.chatgpt__control-button').css({ 'display': 'flex' });
            $('.chatgpt__control-button').animate({
                'opacity': 1
            }, ANIMATION_TIME);

            this._buttonState = true;
        }
    }

    _hideControlButton() {
        if (this._getControlButtonState()) {
            $('.chatgpt__control-button').animate({
                'opacity': 0
            }, ANIMATION_TIME, () => {
                $('.chatgpt__control-button').css({ 'display': 'none' });
                
                this._buttonState = false;
            });
        }
    }

    _getControlButtonState() {
        return this._buttonState;
    }
}