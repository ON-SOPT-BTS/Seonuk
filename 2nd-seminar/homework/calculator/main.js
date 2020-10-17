function init() {
    const { add, subtract, multiply, divide } = require("./calculator");

    console.log(`1 + 1 = ${add(1, 1)}`);
    console.log(`2 - 2 = ${subtract(2, 2)}`);
    console.log(`3 * 3 = ${multiply(3, 3)}`);
    console.log(`4 + 4 = ${divide(4, 4)}`);
}

init();
