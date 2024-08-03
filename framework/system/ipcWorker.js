/**
 * Класс для работы с ipcMain
 */
class ipcWorker {
    constructor(ipcMain) {
        this.ipcCopy = ipcMain;
    }

    /**
     * Добавление обработчика
     * @param {string} channel 
     * @param {function} callback 
     */
    _addListener(channel, callback) {
        if (typeof channel === 'string' && typeof callback === 'function') {
            this.ipcCopy.on(channel, callback);
        }
    }

    /**
     * Add .handle listener
     * @param {string} channel 
     * @param {Function} callback 
     */
    _addHandler(channel, callback) {
        if (typeof channel === 'string' && typeof callback === 'function') {
            this.ipcCopy.handle(channel, callback);
        }
    }
}

exports.ipcWorker = ipcWorker;