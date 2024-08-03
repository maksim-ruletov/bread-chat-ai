const { BrowserWindow } = require('electron');
const { ErrorLog, CreateErrorMessageBox } = require('./ErrorLog.js');
const fs = require('fs');
const path = require('path');

/**
 * Создание базового окна, которые будет передано
 * в глобальный контекст всего фреймворка.
 * 
 * Получает базовую настройку в виде названия
 * окна. Размеры окна настраиваются отдельно.
 * Все остальные порамерты нужно писать
 * самостоятельно.
 */
class Window {
    constructor(windowTitle) {
        this.size = {
            width: 0,
            height: 0
        }

        this.settings = {}

        this.title = windowTitle;
        this.application;
        this.version = '0.28.152r-beta';
    }

    /**
     * Создание прототипа окна
     */
    MakeWindow() {
        this.application = new BrowserWindow({
            width: this.size.width,
            height: this.size.height,
            title: this.title,
            icon: path.join(__dirname, 'media', 'bread-icon.png'),
            ...this.settings
        });
    }

    /**
     * Разгрузка текщего окна.
     * 
     * @param {string} fileName 
     */
    LoadScreen(fileName) {
        if (!fileName || typeof fileName !== 'string' || !fs.existsSync(fileName)) {
            ErrorLog.AddLogToFile('Failed to load screen', 'filename not found or not a string!');

            this.application.hide();

            CreateErrorMessageBox('Failed to start application', 'Failed to load start screen.', 'More details in error.log file');
        }

        this.application.loadFile(fileName);
    }

    /**
     * Изменение размеров окна.
     * 
     * @param {number} windowWidth 
     * @param {number} windowHeight 
     */
    SetWindowSize(windowWidth, windowHeight) {
        if (!windowWidth || typeof windowWidth !== 'number' || windowWidth <= 0) {
            ErrorLog.AddLogToFile('Failed to initialize window', 'window width isn\'t number or less then 0!');

            this.application.hide();

            CreateErrorMessageBox('Failed to start application', 'Failed to initialize window', 'More details in error.log file');
        }

        if (!windowHeight || typeof windowHeight !== 'number' || windowHeight <= 0) {
            ErrorLog.AddLogToFile('Failed to initialize window', 'window height isn\'t number or less then 0!');

            this.application.hide();

            CreateErrorMessageBox('Failed to start application', 'Failed to initialize window', 'More details in error.log file');
        }

        if (windowWidth) this.size.width = windowWidth;
        if (windowHeight) this.size.height = windowHeight;
    }

    /**
     * Добавление своего параметра к окну.
     * 
     * @param {string} settingName 
     * @param {any} settingValue 
     */
    SetCustomSetting(settingName, settingValue) {
        if (typeof settingName !== 'string') {
            return ErrorLog.AddLogToFile('Failed to add custom property', 'property key isn\'t string');
        }

        this.settings[settingName] = settingValue;
    }

    /**
     * Возвращает протип окна
     * 
     * @returns {BrowserWindow}
     */
    DropWindow() {
        return this.application;
    }

    /**
     * Добавить скрипт
     * @param {string} preloadFilePath 
     */
    SetupPreload(preloadFilePath) {
        this.settings['webPreferences']['nodeIntegration'] = true;
        this.settings['webPreferences']['preload'] = preloadFilePath;
    }
}

exports.Window = Window;