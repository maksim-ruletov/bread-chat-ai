exports.testFolders = () => {
    const fs = require('fs');

    if (!fs.existsSync(`${exports.homeDirectory}`))
    {
        fs.mkdir(`${exports.homeDirectory}`, (error) => {
            /* error log here */
        });
    }

    if (!fs.existsSync(`${exports.homeDirectory}/tokens.json`))
    {
        fs.appendFileSync(`${exports.homeDirectory}/tokens.json`, JSON.stringify({
            activeToken: null,
            list: []
        }, null, '\t'));
    }

    if (!fs.existsSync(`${exports.homeDirectory}/chats`))
    {
        fs.mkdir(`${exports.homeDirectory}/chats`, (error) => {
            /* error log here */
        });
    }

    if (!fs.existsSync(`${exports.homeDirectory}/chats.json`))
    {
        fs.appendFileSync(`${exports.homeDirectory}/chats.json`, JSON.stringify([], null, '\t'));
    }

}

exports.homeDirectory = `${require('../misc.js').getRootDirectory()}/.data/`;