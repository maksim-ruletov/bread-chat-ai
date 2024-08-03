const fs = require('fs');

const { homeDir } = require('./Utils.js');
const { ErrorLog } = require('../system/ErrorLog.js')

/**
 * Класс для работы с чатами
 */
class Chats {
    /**
     * Проверка наличия файлов
     * @returns {boolean}
     */
    static CheckChatsFileExists() {
        return fs.existsSync(`${homeDir}/BreadChatAI/Chats.json`);
    }

    /**
     * Создание файла при его отсутствии
     */
    static CreateChatsFile() {
        if (!this.CheckChatsFileExists()) {
            fs.appendFileSync(`${homeDir}/BreadChatAI/Chats.json`, JSON.stringify([]))
        }
    }

    /**
     * Загрузка нового содержимого
     * @param {*} newChatFile 
     */
    static UploadChatsFile(newChatFile) {
        if (!this.CheckChatsFileExists()) {
            this.CreateChatsFile();
        }

        if (!newChatFile || !Array.isArray(newChatFile)) {
            return ErrorLog.AddLogToFile('Failed to upload Chats content', 'new content is incorrect');
        }

        fs.writeFileSync(`${homeDir}/BreadChatAI/Chats.json`, JSON.stringify(newChatFile));
    }

    static DropChatsFile() {
        return require(`${homeDir}/BreadChatAI/Chats.json`);
    }
}

exports.Chats = Chats;