const fs = require('fs');

const { homeDir } = require('./Utils.js');
const { ErrorLog } = require('../system/ErrorLog.js');

/**
 *  Стандартный класс для работы с
 * конфигурационным файлов.
 */
class Config {
    /**
     * Проверить наличие конфигурационного файла
     */
    static CheckConfigFileExists() {
        return fs.existsSync(`${homeDir}/BreadChatAI/Config.json`);
    }

    /**
     * Создать конфигурационный файл *если таковой не создан
     */
    static CreateConfigFile() {
        if (!fs.existsSync(`${homeDir}/BreadChatAI/Config.json`)) {
            fs.appendFileSync(`${homeDir}/BreadChatAI/Config.json`, JSON.stringify({
                'theme': null,
                'color-preset': 0,
                'tokens': [],
                'open-first-chat': true,
                'global-hot-key': 'Alt + Space',
                'language': null,
                'checked-tutorial': false,
                'lose-focus-on-blur': true,
                'auto-launch': null
            }));
        }
    }

    /**
     * Получить конфигурационный файл
     */
    static DropConfigFile() {
        if (!this.CheckConfigFileExists()) {
            this.CreateConfigFile();
        }

        return require(`${homeDir}/BreadChatAI/Config.json`);
    }

    /**
     * Обновить конфигурационный файл
     */
    static UpdateConfigFile(newConfigFile) {
        if (!this.CheckConfigFileExists()) {
            this.CreateConfigFile();
        }

        if (!newConfigFile || typeof newConfigFile !== 'object' || Array.isArray(newConfigFile)) {
            return ErrorLog.AddLogToFile('Unknown config file', `config file type is Object, but got ${typeof newConfigFile}`);
        }

        fs.writeFileSync(`${homeDir}/BreadChatAI/Config.json`, JSON.stringify(newConfigFile))
    }
}

exports.Config = Config;