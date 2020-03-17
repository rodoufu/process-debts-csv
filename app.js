const readline = require('readline');
const debit = require("./src/debit.js");

/**
 * Preparing to process the file line by line.
 */
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

/**
 * It is using a dictionary but it is possible to use a persistent database for very long files.
 * @type {{}}
 */
let theDebits = {'lines': 0};

/**
 * The code does not use a CSV parser for the case when very big file is used and the parser cannot deal with it.
 * This way it can deal with the stream one line at a time.
 */
rl.on('line', function (line) {
	try {
		theDebits.lines++;
		let row = debit.separateLine(line);
		theDebits = debit.saveDebit(theDebits, row);
	} catch (e) {
		console.error(`There was a problem parsing the line #${theDebits.lines}: "${line}" - ${e}`);
	}
});

/**
 * When the stream is closed the answer is printed in the console.
 */
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
