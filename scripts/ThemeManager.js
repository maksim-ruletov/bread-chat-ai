class ThemeManager {
    static LoadTheme() {
        const theme = api.config.theme;

        if (api.config.theme === 'system') {
            api.ipcRenderer.invoke('get-real-theme').then((_theme) => {
                applyTheme(_theme);
            });
        }
        else {
            applyTheme(theme);
        }

        function applyTheme(theme) {
            const themeSelectors = ['bg', 'accent', 'text', 'accent-hover', 'text-active', 'scrollbar'];

            document.documentElement.style.cssText = themeSelectors.map(item => {
                return `--${item}-cl: var(--${item}-${theme}-cl);`;
            }).join(' ');
        }
    }

    static LoadActiveTheme() {
        document.querySelector('#active-theme').textContent = api.localisation[api.config.language][`app.themes.${api.config.theme}`];
    }

    static LoadSwitchers() {
        ['light', 'dark', 'system'].forEach(item => {
            if (item !== api.config.theme) {
                document.querySelector('#theme-dropdown-list').innerHTML += `<div theme-switcher="${item}">${api.localisation[api.config.language][`app.themes.${item}`]}</div>`;
            }
        });

        ['light', 'dark', 'system'].forEach(item => {
            if (item !== api.config.theme) {
                document.querySelector(`[theme-switcher="${item}"]`).addEventListener('click', () => {
                    document.querySelector('.blur-block-2').style.zIndex = 101;
                    document.querySelector('.blur-block-2').style.opacity = 'var(--blur)';
                    
                    document.querySelector('.settings__change-popup').style.zIndex = 102;
                    document.querySelector('.settings__change-popup').style.opacity = 1;

                    document.querySelector('#restart').addEventListener('click', () => {
                        this.SwitchTheme(item);
                        api.ipcRenderer.send('reload-window');
                    })
                });
            }
        });
    }

    static SwitchTheme(newTheme) {
        if (typeof newTheme === 'string' && ['light', 'dark', 'system'].includes(newTheme)) {
            api.ipcRenderer.send('change-theme', newTheme);
        }
    }
}