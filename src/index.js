
function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const newExpr = /\d+|\+|\-|\*|\/|\(|\)/g;
    const newExprArr = expr.match(newExpr);

    const leftBrackets = expr.match(/\(/g) ? expr.match(/\(/g).length : 0;
    const rightBrackets = expr.match(/\)/g) ? expr.match(/\)/g).length : 0;

    if (leftBrackets !== rightBrackets) {
        throw new Error("ExpressionError: Brackets must be paired");
    }

    const operators = {
        "+": {
            priority: 1,
            action: (a, b) => a + b
        },
        "-": {
            priority: 1,
            action: (a, b) => a - b
        },
        "*": {
            priority: 2,
            action: (a, b) => a * b
        },
        "/": {
            priority: 2,
            action: (a, b) => a / b
        },
        "(": {},
        ")": {}
    };

    function calc(b, a, op) {
        if (op === "/" && b === 0) {
            throw new Error("TypeError: Division by zero.");
        }

        return operators[op].action(a, b);
    }

    const numberStack = [];
    const operatorStack = [];

    for (let i = 0; i < newExprArr.length; i++) {
        if (!isNaN(newExprArr[i])) {
            numberStack.push(Number(newExprArr[i]));
        }

        function addOperator() {
            if (!operatorStack.length ||
                operatorStack[operatorStack.length - 1] === "(" ||
                newExprArr[i] === "("
            ) {
                operatorStack.push(newExprArr[i]);
            } else if (newExprArr[i] === ")") {
                countBrackets();
                operatorStack.pop();
            } else if (
                operators[newExprArr[i]].priority >
                operators[operatorStack[operatorStack.length - 1]].priority
            ) {
                operatorStack.push(newExprArr[i]);
            } else {
                numberStack.push(
                    calc(numberStack.pop(), numberStack.pop(), operatorStack.pop())
                );
                addOperator();
            }
        }

        function countBrackets() {
            if (operatorStack[operatorStack.length - 1] === "(") {
                return;
            }

            numberStack.push(
                calc(numberStack.pop(), numberStack.pop(), operatorStack.pop())
            );

            countBrackets();
        }

        if (newExprArr[i] in operators) {
            addOperator();
        }
    }

    function countRest() {
        if (!operatorStack.length) {
            return;
        }

        numberStack.push(
            calc(numberStack.pop(), numberStack.pop(), operatorStack.pop())
        );

        countRest();
    }

    countRest();

    return numberStack[0];
}

module.exports = {
    expressionCalculator
};
