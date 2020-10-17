const add = (num1, num2) => {
    return num1 + num2;
};

const substract = (num1, num2) => {
    return num1 - num2;
};

const multiply = (num1, num2) => {
    return num1 * num2;
};

const divide = (num1, num2) => {
    console.log("divide");
    try {
        if (num2 === 0) {
            throw new Error("num2: 0");
        }
    } catch (e) {
        console.error(e);
    }

    return num1 / num2;
};

divide(1, 0);
