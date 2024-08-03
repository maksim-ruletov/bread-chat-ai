class BlurBoxManager {
    static _showBlurBox() {
        document.querySelector('.blur-block-2').style.zIndex = 101;

        $('.blur-block-2').animate({
            'opacity': .90
        }, ANIMATION_TIME);
    }

    static _hideBlurBox() {
        $('.blur-block-2').animate({
            'opacity': 0
        }, ANIMATION_TIME, () => {
            document.querySelector('.blur-block-2').style.zIndex = -101;
        });
    }
}

class SettingsPopupManager {
    static ShowPopup() {
        document.querySelector('.settings__change-popup').style.zIndex = 102;

        $('.settings__change-popup').animate({
            'opacity': 1
        }, ANIMATION_TIME);
    }

    static HidePopup() {
        $('.settings__change-popup').animate({
            'opacity': 0
        }, ANIMATION_TIME, () => {
            document.querySelector('.settings__change-popup').style.zIndex = -102;
        });
    }

    static DeclineChanges() {
        BlurBoxManager._hideBlurBox();
        this.HidePopup();
    }
}

class SettingsHotkeyListenerPopup {
    static _showPopup() {
        $('.settings__hotkey-listener').css({ 'z-index': 103 });
        $('.settings__hotkey-listener').animate({
            'opacity': 1
        }, ANIMATION_TIME);
    }
    
    static _hidePopup() {
        $('.settings__hotkey-listener').animate({
            'opacity': 0
        }, ANIMATION_TIME, () => {
            $('.settings__hotkey-listener').css({ 'z-index': -103 });
        });
    }
}

class Tutorial {
    constructor() {
        this._tutorialPoints = [
            {
                'label': 'control',
                'name': 'app.tutorials.control.title',
                'icon': 'fa-window-restore',
                'description':
                `
                <p class="popup__description"><span translate="app.tutorials.control.description"></span><span class="hotkey__item">Alt</span> + <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">Space</span></p>
                <p class="popup__description" translate="app.tutorials.control.description-2"></p>
                `
            },
            {
                'label': `start`,
                'name': `app.tutorials.start.title`,
                'icon': `fa-door-open`,
                'description': `<p class="popup__description" translate="app.tutorials.start.description"></p>`
            },
            {
                'label': `functional`,
                'name': `app.tutorials.functional.title`,
                'icon': `fa-gear`,
                'description': `<p class="popup__description" translate="app.tutorials.functional.description"></p>`
            },
            {
                'label': `keyboard`,
                'name': `app.tutorials.keyboard.title`,
                'icon': `fa-keyboard`,
                'description':
                    `
                    <p class="popup__description" style="line-height: 25px;">
                        <span translate="app.tutorials.keyboard.description"></span> <span class="hotkey__item">Ctrl</span> + <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">,</span>
                    </p>
                    `
            },
            {
                'label': `additional`,
                'name': `app.tutorials.additional.title`,
                'icon': `fa-ellipsis`,
                'description': 
                    `
                    <p class="popup__description">
                       <span translate="app.tutorials.additional.description"></span> <a target="_blank" style="text-decoration: underline;" href="https://github.com/UndevSoftware/bread-chat-ai">Github</a>
                    </p>
                    `
            },
            {
                'label': `support`,
                'name': `app.tutorials.support.title`,
                'icon': `fa-circle-dollar-to-slot`,
                'description':
                    `
                    <p class="popup__description">
                        <span translate="app.tutorials.support.description"></span> <a target="_blank" href="https://www.donationalerts.com/r/ruletkasuperstar"><span style="text-decoration: underline;" translate="app.tutorials.support.link"></span></a>
                    </p>
                    `
            }
        ];
    }

    _createAndAppend() {
        this._tutorialPoints.forEach((item, index) => {
            document.querySelector('.tutorial').innerHTML +=
                `
                <div tutorial-point="${item.label}" class="tutorial__popup" ${item.label !== 'control' ? 'style="display: none; opacity: 0"' : ''}>
                    <h3 class="popup__heading" translate="${item.name}"></h3>
                    <div class="popup__icon">
                        <span class="fa-regular ${item.icon} awesome"></span>
                    </div>
                    ${item.description}
                    <div class="popup__buttons">
                        ${item.label !== 'control' ? `<button onclick="Tutorial._previewPoint('${this._tutorialPoints[index - 1].label}', '${item.label}')" class="popup__button" translate="app.popup.buttons.back"></button>` : ''}
                        <button onclick="Tutorial.${item.label !== 'support' ? `_nextPoint('${item.label}', '${this._tutorialPoints[index + 1].label}')` : '_endTutorial()'}" class="popup__button" translate="app.popup.buttons.${item.label === 'support' ? 'end' : 'next'}"></button>
                    </div>
                </div>
                `;
        });
    }

    static _nextPoint(preview, next) {
        $(`[tutorial-point="${preview}"]`).animate({
            'opacity': 0
        }, ANIMATION_TIME, () => {
            $(`[tutorial-point="${preview}"]`).css({ 'display': 'none' });

            $(`[tutorial-point="${next}"]`).css({ 'display': 'flex' });
            $(`[tutorial-point="${next}"]`).animate({
                'opacity': 1
            }, ANIMATION_TIME);
        });
    }

    static _previewPoint(back, preview) {
        $(`[tutorial-point="${preview}"]`).animate({
            'opacity': 0
        }, ANIMATION_TIME, () => {
            $(`[tutorial-point="${preview}"]`).css({ 'display': 'none' });

            $(`[tutorial-point="${back}"]`).css({ 'display': 'flex' });
            $(`[tutorial-point="${back}"]`).animate({
                'opacity': 1
            }, ANIMATION_TIME);
        });
    }

    static _endTutorial() {
        api.invoke('end-tutorial').then(response => {
            if (response === "ok") {
                document.querySelector('.tutorial').style.display = 'none';
                document.querySelector('.tutorial').style.zIndex = '-102';

                document.querySelector('.blur-block').style.opacity = 0;
                document.querySelector('.blur-block').style.zIndex = -101;

                initialize();
            }
        });
    }
}

class SettingsHotkeyList {
    constructor() {
        this.hotkeysList = [
            {
                'name': `settings.keyboard.title.open-settings`,
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">,</span>
                        </div>
                        `
            },
            {
                'name': `settings.keyboard.title.open-chats`,
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">S</span>
                        </div>
                        `
            },
            {
                'name': `settings.keyboard.title.open-bookmarks`,
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">D</span>
                        </div>
                        `
            },
            {
                'name': `settings.keyboard.title.open-any-chat`,
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">1</span>
                            -
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">9</span>
                        </div>
                        `
            },
            {
                'name': `settings.keyboard.title.copy-last-gpt-message`,
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">F</span>
                        </div>
                        `
            },
            {
                'name': 'settings.keyboard.title.reset-context',
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">E</span>
                        </div>
                        `
            },
            {
                'name': 'settings.keyboard.title.create-chat',
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">T</span>
                        </div>
                        `
            },
            {
                'name': 'settings.keyboard.title.delete-chat',
                'code': `
                        <div>
                            <span class="hotkey__item">Ctrl</span>
                            +
                            <span class="hotkey__item" style="padding-left: 10px; padding-right: 10px;">W</span>
                        </div>
                        `
            }
        ]
    }

    /**
     * Create all elements of hotkeyList
     */
    _createAndAppend() {
        return new Promise((resolve, reject) => {
            this.hotkeysList.forEach(item => {
                document.querySelector(`#hotkeys-list`).innerHTML +=
                `
                <div class="welcome__hotkey" style="display: flex; justify-content: space-between; width: 100%;">
                    <span class="hotkey__name" translate="${item.name}"></span>
                    ${item.code}
                </div>
                `
            });

            return resolve();
        })
    }
}