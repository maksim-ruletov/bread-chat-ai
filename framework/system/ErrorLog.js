const fs = require('fs');
const { homeDir } = require('../filesystem/Utils.js');
const { dialog, app } = require('electron');

const FILE_PATH = `${homeDir}/BreadChatAI/error.log`;

/**
 * Данный класс создаёт и управляет журналами отладки
 */
class ErrorLog {
    /**
     * Проверка наличия журнала отладки
     * @returns {boolean}
     */
    static CheckErrorLogFileExist() {
        return fs.existsSync(FILE_PATH);
    }

    /**
     * Создание журнала отладки
     */
    static CreateErrorLogFile() {
        if (!this.CheckErrorLogFileExist()) {
            fs.appendFileSync(FILE_PATH, '');
        }
    }

    /**
     * Очистка журнала отладки
     */
    static CleanErrorLog() {
        if (!this.CheckErrorLogFileExist()) {
            this.CreateErrorLogFile();
            return;
        }

        fs.writeFileSync(FILE_PATH, '');
    }

    /**
     * Добавить запись в журнал
     * @param {string} logTitle
     * @param {string} logText
     */
    static AddLogToFile(logTitle, logText) {
        if (!this.CheckErrorLogFileExist()) {
            this.CreateErrorLogFile();
        }

        if (!logTitle || !logText) return false;
        if (typeof logTitle !== 'string' && typeof logText !== 'string') return false

        fs.appendFileSync(FILE_PATH, `[${Date.now()}] [${logTitle}] ${logText}\n`);
    }
}

function CreateErrorMessageBox(title, message, detail) {
    throw dialog.showMessageBox(null, {
        type: 'error',
        buttons: ['Close'],
        defaultId: 2,
        title,
        message,
        detail,
    }).then((response) => {
        if (response) app.quit();
    });
}

exports.ErrorLog = ErrorLog;
exports.CreateErrorMessageBox = CreateErrorMessageBox;