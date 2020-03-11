const bcrypt = require('bcryptjs');

const encryption = {
    encrypt(password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    }
}

module.exports = encryption;