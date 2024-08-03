class TokenEventManager {
    constructor() {
        this._dropdownElements = [];
        this._activeService = null;
    }

    _collect() {
        document.querySelectorAll(`#service-dropdown-list > div`).forEach(item => {
            this._dropdownElements.push(item);
        });
    }

    _addListeners() {
        this._dropdownElements.forEach(item => {
            item.addEventListener('click', () => {
                if (this._activeService) {
                    $(`[service="${this._activeService}"]`).css({ 'display': 'block' });
                }

                this._activeService = item.getAttribute('service');
                $(item).css({ 'display': 'none' });
                $(`#active-service`).text(item.textContent);
            });
        });
    }

    _reset() {
        if (this._activeService) {
            $(`[service="${this._activeService}"]`).css({ 'display': 'block' });
        }

        $(`#active-service`).text(api.localisation[api.getConfig().language]['settings.add-token.select']);
        $('.add-token-popup__token').val('');
    }
}