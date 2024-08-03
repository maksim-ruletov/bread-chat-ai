const { Tray, Menu } = require('electron');

/**
 * Класс для работы с Tray'ем
 */
class CustomTray {
    constructor(iconPath) {
        this.iconPath = iconPath;

        this.handlers = [];
        this.trayPrototype;
    }

    AddHandler(handlerTitle, handler) {
        this.handlers.push({
            label: handlerTitle,
            click: handler
        });
    }

    CreateTray() {
        this.trayPrototype = new Tray(this.iconPath);

        this.trayPrototype.setTitle('BreadChatAI');
        this.trayPrototype.setToolTip('BreadChatAI');

        this.trayPrototype.setContextMenu(Menu.buildFromTemplate(this.handlers));
    }

    _destroyTray()
    {
        this.trayPrototype.destroy();
        this.trayPrototype = null;
    }

    _event(a_eventName, a_eventListener)
    {
        if (!this.trayPrototype instanceof Tray)
        {
            return /* error here */;
        }

        if (typeof a_eventName !== 'string')
        {
            return /* error here */;
        }

        if (typeof a_eventListener !== 'function')
        {
            return /* error here */;
        }

        this.trayPrototype.on(a_eventName, a_eventListener);
    }
}

exports.CustomTray = CustomTray;