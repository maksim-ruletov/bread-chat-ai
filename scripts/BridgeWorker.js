api.on('render-settings', () => {
    closeAllExceptOne('settings');

    SETTINGS_MANAGER._showSettings();

    api.invoke('active-window');
});

api.on('render-bookmarks', () => {
    closeAllExceptOne('bookmarks');

    BOOKMARKS_MANAGER._showBookmarks();

    api.invoke('active-window');
});

api.on('focus', () => {
    if (!SETTINGS_MANAGER._getSettingsScreenState() && !INPUT_BOX_MANAGER._getInputBoxState()) {
        document.querySelector('.search-box__input').focus();
    }
});

api.on('change-theme', (event, theme) => {
    const themeSelectors = ['bg', 'accent', 'text', 'accent-hover', 'text-active', 'scrollbar'];

    document.documentElement.style.cssText = themeSelectors.map(item => {
        return `--${item}-cl: var(--${item}-${theme}-cl);`;
    }).join(' ');
});