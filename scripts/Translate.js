function translateSettings() {
    document.querySelectorAll(`.settings__content [translate]`).forEach(item => {
        item.textContent = api.localisation[api.config.language][item.getAttribute('translate')];
    });
}

function translateAll() {
    document.querySelectorAll('[translate]').forEach(item => {
        if (!item.textContent) {
            item.textContent = api.localisation[api.config.language][item.getAttribute('translate')];
        }
    })
}