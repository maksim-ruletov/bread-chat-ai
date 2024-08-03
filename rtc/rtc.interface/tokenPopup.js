class TokenPopup {
    constructor() {
        this._popupState = false;
    }

    _showPopup() {
        BlurBoxManager._showBlurBox();

        $('.content__popup-wrapper').css({ 'z-index': '103' });
        $('.content__popup-wrapper').animate({
            'opacity': 1
        }, ANIMATION_TIME, () => {
            this._popupState = true;
        });
    }

    _hidePopup() {
        BlurBoxManager._hideBlurBox();

        $('.content__popup-wrapper').animate({
            'opacity': 0
        }, ANIMATION_TIME, () => {
            $('.content__popup-wrapper').css({ 'z-index': '-103' });
            this._popupState = false;
        });
    }

    _getPopupState() {
        return this._popupState;
    }
}

function confirmButtonClickHandler() {
    let service = ADD_TOKEN_HANDLER._activeService;
    let token = $('.add-token-popup__token').val();

    if (!service)
    {
        return Note.createNote(api.localisation[api.getConfig().language]['errors.service-not-found'], 1500)
    }

    if (token.length < 20)
    {
        return Note.createNote(api.localisation[api.getConfig().language]['errors.token-small'], 1500);
    }

    return api.ipcRenderer.invoke('create-token', service, token);  
}