const fs = require('fs');

const { homeDir } = require('./Utils.js');
const { ErrorLog } = require('../system/ErrorLog.js');
const { Message } = require('../../import.js');

/**
 * Избранные сообщения
 */
class Loved {
    /**
     * Проверить наличие файла
     * @returns {boolean}
     */
    static CheckLovedFileExist() {
        return fs.existsSync(`${homeDir}/BreadChatAI/Loved.json`);
    }

    /**
     * Создание файла, если его нет
     */
    static CreateLovedFile() {
        if (!fs.existsSync(`${homeDir}/BreadChatAI/Loved.json`)) {
            fs.appendFileSync(`${homeDir}/BreadChatAI/Loved.json`, '[]');
        }
    }

    /**
     * Получение файла
     * @returns 
     */
    static DropLovedFile() {
        if (!this.CheckLovedFileExist()) {
            this.CreateLovedFile();
        }

        return require(`${homeDir}/BreadChatAI/Loved.json`);
    }

    /**
     * Обновление файла понравившихся ответов
     * @param {*} newLovedArray 
     */
    static UpdateLovedFile(newLovedArray) {
        if (!newLovedArray || !Array.isArray(newLovedArray)) {
            return ErrorLog.AddLogToFile('Unknown loved file', `loved file type is Array, but got ${typeof newConfigFile}`)
        }

        fs.writeFileSync(`${homeDir}/BreadChatAI/Loved.json`, JSON.stringify(newLovedArray));
    }

    /**
     * Добавить сообщение
     * @param {Message} message 
     */
    static AddMessage(message) {
        if (!this.CheckLovedFileExist()) {
            this.CreateLovedFile();
        }

        if (!message || !message instanceof Message) {
            return ErrorLog.AddLogToFile('Unknown message', `message must be a Message class`);
        }

        let loved = this.DropLovedFile()
        loved.push(message);
        this.UpdateLovedFile(loved);
    }

    /**
     * Удалить сообщение из понравившихся
     * @param {number} messageInnerId 
     */
    static RemoveMessage(messageInnerId) {
        if (!this.CheckLovedFileExist()) {
            this.CreateLovedFile();
        }

        if (!messageInnerId || typeof messageInnerId !== 'number') {
            return ErrorLog.AddLogToFile('Unknown message id', `message id must be a number`);
        }

        if (messageInnerId < 0 || messageInnerId > this.DropLovedFile().length) {
            return ErrorLog.AddLogToFile('Unknown message id', `message id out of range`);
        }

        const loved = this.DropLovedFile();
        loved.splice(messageInnerId, 1);
        this.UpdateLovedFile(loved);
    }
}

exports.Loved = Loved;