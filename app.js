const readline = require('readline');
const debit = require("./src/debit.js");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

rl.on('line', function (line) {
	// console.log(`line: ${line}`);
	console.log(`line: ${debit.separateLine(line)}`);
});