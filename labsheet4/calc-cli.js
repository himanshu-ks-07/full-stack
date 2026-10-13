const args = process.argv.slice(2);
const num1 = parseFloat(args[0]);
const num2 = parseFloat(args[1]);
const operator = args[2];

let result;
if (operator === '+') result = num1 + num2;
else if (operator === '-') result = num1 - num2;
else if (operator === '*') result = num1 * num2;
else if (operator === '/') result = num1 / num2;

console.log(`Result: ${result}`);