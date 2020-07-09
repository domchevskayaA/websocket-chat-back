const fsPromises = require('fs').promises;

const saveAvatar = async (data, userName) => {
    if (!data) return null;
    const imgName = userName.replace(' ', '').toLowerCase();
    const img = data.image;
    const dirPath = 'static/images/avatars';
    const fileName = `${imgName}.${data.extension}`;

    try {
        await fsPromises.mkdir(dirPath, {recursive: true})
        await fsPromises.writeFile(`${dirPath}/${fileName}`, img, 'base64');

        return `${dirPath}/${fileName}`;
    } catch (e) {
        console.error(e);
    }
    return null;
};

module.exports = {
    saveAvatar,
};