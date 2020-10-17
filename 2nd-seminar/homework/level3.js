function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        const crypto = require("crypto");

        crypto.randomBytes(64, (err, buf) => {
            const salt = buf.toString("base64");

            crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, key) => {
                if (!err) {
                    resolve(key.toString("base64"));
                } else {
                    reject(err);
                }
            });
        });
    });
}

function writeFile(data, file_name) {
    const fs = require("fs");

    fs.writeFile(`${file_name}.txt`, data, () => {
        console.log(`file[${file_name}.txt] write complete`);
    });
}

async function init() {
    const password = "1234";

    try {
        const encryptedPassword = await encryptPassword(password);
        writeFile(encryptedPassword, "encryption");
    } catch (e) {
        console.error(e);
    }
}

init();
