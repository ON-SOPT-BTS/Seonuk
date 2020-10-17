const crypto = require("crypto");

// const password = "123123";
// const base64 = crypto
//     .createHash("sha512")
//     .update(password)
//     .digest("base64");

// const hex = crypto
//     .createHash("sha512")
//     .update(password)
//     .digest("hex");

// console.log("base: ", base64);
// console.log('hex: ',hex);

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString("base64");
    console.log(`salt: ${salt}`);

    crypto.pbkdf2("password", salt, 100000, 64, "sha512", (err, key) => {
        console.log(`password: ${key.toString("base64")}`);
    });
});
