const os = require('os');

function GetHomeDir() {
    let homeDir;

    /**
     * Получение платформы.
     */
    switch(process.platform) {
    case "darwin":
    case "linux":
        homeDir = os.homedir() + '/.config/UndevSoftware/';
        break;
    case "win32":
        homeDir = process.env.APPDATA + '/UndevSoftware/';
        break;
    }

    return homeDir;
}

exports.homeDir = GetHomeDir();