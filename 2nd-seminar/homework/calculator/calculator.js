const verifyNumberType = (a, b) => {
    if (typeof a === "number" && typeof b === "number") return true;

    return false;
};

const add = (a, b) => {
    try {
        if (!verifyNumberType(a, b)) {
            throw new Error("Is Not a Number");
        }
        return a + b;
    } catch (e) {
        console.error(e);
    }
};

const subtract = (a, b) => {
    try {
        if (!verifyNumberType(a, b)) {
            throw new Error("Is Not a Number");
        }

        return a - b;
    } catch (e) {
        console.error(e);
    }
};

const multiply = (a, b) => {
    try {
        if (!verifyNumberType(a, b)) {
            throw new Error("Is Not a Number");
        }

        return a * b;
    } catch (e) {
        console.error(e);
    }
};

const divide = (a, b) => {
    try {
        if (!verifyNumberType(a, b)) {
            throw new Error("Is Not a Number");
        }
        if (b === 0) {
            throw new Error("divide by zero error encountered");
        }

        return a / b;
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    add,
    substract,
    multiply,
    divide
};
