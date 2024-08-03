class LanguageManager {
    static LoadActiveLanguage() {
        const languageFullName = {'ru':'russian','en':'english'}[api.config.language];

        document.querySelector('#active-language').textContent = api.localisation[api.config.language][`app.languages.${languageFullName}`];
    }

    static LoadSwitchers() {
        ['ru', 'en'].forEach(item => {
            const languageFullName = {'ru':'russian','en':'english'}[item];

            if (item !== api.config.language) {
                document.querySelector('#language-dropdown-list').innerHTML += `<div language-switcher="${item}">${api.localisation[api.config.language][`app.languages.${languageFullName}`]}</div>`;

                document.querySelector(`[language-switcher="${item}"]`).addEventListener('click', () => {
                    document.querySelector('.blur-block-2').style.zIndex = 101;
                    document.querySelector('.blur-block-2').style.opacity = 'var(--blur)';
                    
                    document.querySelector('.settings__change-popup').style.zIndex = 102;
                    document.querySelector('.settings__change-popup').style.opacity = 1;

                    document.querySelector('#restart').addEventListener('click', () => {
                        this.SwitchLanguage(item);
                        api.ipcRenderer.send('reload-window');
                    })
                });
            }
        });
    }

    static SwitchLanguage(newLanguage) {
        if (typeof newLanguage === 'string' && ['ru', 'en'].includes(newLanguage)) {
            api.ipcRenderer.send('change-language', newLanguage);
        }
    }
}