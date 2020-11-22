const crypto = require("crypto");

const usersDB = require("../../modules/usersDB");

const getUserById = id => {
    const user = usersDB.find(user => user.id == id);

    return user;
};

const encryptPassword = password => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            const salt = buf.toString("base64");

            crypto.pbkdf2(password, salt, 123456, 64, "sha512", (err, key) => {
                if (err) {
                    reject(err);
                }
                if (!err) {
                    resolve({
                        salt,
                        key: key.toString("base64")
                    });
                }
            });
        });
    });
};

const verifyPassword = (id, password) => {
    return new Promise((resolve, reject) => {
        const user = usersDB.find(user => user.id == id);

        crypto.pbkdf2(password, user.salt, 123456, 64, "sha512", (err, key) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                if (key.toString("base64") == user.password) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
};
const getUsers = () => {
    return usersDB;
};

module.exports = {
    getUserById,
    getUsers,
    encryptPassword,
    verifyPassword
};
