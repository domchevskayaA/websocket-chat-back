const fs = require('fs');

module.exports = {
    saveAvatar: (data, userName) => {
        if (!data) return 'static/images/avatars/no_avatar.png';
        const imgName = userName.replace(' ', '').toLowerCase();
        const img = data.image;
        const fileUrl = `static/images/avatars/${imgName}.${data.extension}`;
        fs.writeFile(fileUrl, img, 'base64', function(err){
            if (err) throw err
        })
        return fileUrl;
    }
};