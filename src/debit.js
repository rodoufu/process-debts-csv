/**
 * There is a problem with the line validation.
 */
class UnexpectedFormatError extends Error {
	constructor(message) {
		super(message);
	}
}

/**
 * The value for the debit is not a valid number.
 */
class InvalidValueError extends Error {
	constructor(message) {
		super(message);
	}
}

/**
 * Receives a line of the CSV file and parse it into an object.
 * @param line The CSV file line.
 * @returns {{from: String, to: String, value: number}} The parsed object with the information for the line.
 */
function separateLine(line) {
	if (!line) {
		throw new UnexpectedFormatError("Null line");
	}
	line = line.trim();
	if (line.length === 0) {
		throw new UnexpectedFormatError("Empty line");
	}

	let names = [[], [], []];
	let namesIdx = 0;
	let lineIdx = 0;
	let quotation = null;
	for (; namesIdx < 3 && lineIdx < line.length; ++namesIdx) {
		for (; lineIdx < line.length; ++lineIdx) {
			if (line[lineIdx] === '"' || line[lineIdx] === "'") {
				if (!quotation) {
					quotation = line[lineIdx];
				} else if (quotation === line[lineIdx]) {
					quotation = '!';
				} else {
					throw new UnexpectedFormatError(`Unexpected character: "${line[lineIdx]}"`);
				}
			} else if (line[lineIdx] === ',') {
				if (quotation && quotation !== '!') {
					throw new UnexpectedFormatError(`Unexpected column value: "${names[namesIdx]}"`);
				}
				quotation = null;
				if (++namesIdx === 3) {
					throw new UnexpectedFormatError(`Too many columns: "${line}"`);
				}
			} else {
				names[namesIdx] += line[lineIdx];
			}
		}
	}

	if (namesIdx < 3) {
		throw new UnexpectedFormatError("Missing values");
	}

	let value = Number(names[2]);

	if (isNaN(value)) {
		throw new InvalidValueError(`Unexpected format, value is not a number: '${names[2].trim()}'`);
	}

	return {
		'from': names[0],
		'to': names[1],
		'value': value,
	};
}

/**
 * Includes a debit to the dictionary or adds a value to an existing one.
 * For negative values the direction of the debit is inverted.
 * @param debits The debits dictionary.
 * @param row The row containing the debit information.
 * @returns {*} The updated debits dictionary.
 */
function saveDebit(debits, row) {
	if (!debits) {
		debits = {};
	}
	if (row.value < 0) {
		let temp = row.from;
		row.from = row.to;
		row.to = temp;
		row.value *= -1;
	}
	let from = debits[row.from] || {};
	let to = from[row.to] || 0;
	to += row.value;
	from[row.to] = to;
	debits[row.from] = from;

	return debits;
}

module.exports = {
	UnexpectedFormatError,
	InvalidValueError,
	separateLine,
	saveDebit,
};
