const readline = require('readline');
const debit = require("./src/debit.js");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

let theDebits = null;

rl.on('line', function (line) {
	try {
		let row = debit.separateLine(line);
		theDebits = debit.saveDebit(theDebits, row);
	} catch (e) {
		console.error(`There was a problem parsing the line ${line} - ${e}`);
	}
});

rl.on('close', function() {
	if (theDebits) {
		Object.entries(theDebits).forEach(([key, value]) => {
			Object.entries(value).forEach(([keyInner, valueInner]) => {
				console.log(`${key},${keyInner},${valueInner.toFixed(2)}`);
			});
		});
	}
	process.exit(0);
});
