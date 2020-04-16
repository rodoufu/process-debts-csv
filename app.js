'use strict';

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
let theDebits = {};

/**
 * Count the number of lines, it is used to print the line the problem happened.
 * @type {number}
 */
let linesCount = 0;
/**
 * Indicates if the application faced an error.
 * @type {number}
 */
let hasError = 0;

/**
 * The code does not use a CSV parser for the case when very big file is used and the parser cannot deal with it.
 * This way it can deal with the stream one line at a time.
 */
rl.on('line', function (line) {
	try {
		linesCount++;
		let row = debit.separateLine(line);
		theDebits = debit.saveDebit(theDebits, row);
	} catch (e) {
		hasError = 1;
		console.error(`There was a problem parsing the line #${linesCount}: "${line}" - ${e}`);
	}
});

/**
 * When the stream is closed the answer is printed in the console using 2 digits for precision.
 */
rl.on('close', function () {
	if (theDebits) {
		theDebits = rem
		Object.entries(theDebits).forEach(([key, value]) => {
			Object.entries(value).forEach(([keyInner, valueInner]) => {
				console.log(`${key},${keyInner},${valueInner.toFixed(2)}`);
			});
		});
	}
	process.exit(hasError);
});
