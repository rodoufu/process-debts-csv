class UnexpectedFormatError extends Error {
	constructor(message) {
		super(message);
	}
}

class InvalidStringError extends Error {
	constructor(message) {
		super(message);
	}
}

class InvalidValueError extends Error {
	constructor(message) {
		super(message);
	}
}

function separateLine(line, separator = ',') {
	if (!line) {
		throw new UnexpectedFormatError("null line");
	}
	line = line.trim();
	if (line.length === 0) {
		throw new UnexpectedFormatError("Empty line");
	}

	const linePat = separator === ',' ?
		new RegExp(/^(.+),(.+),(.+)$/) :
		new RegExp(/^(.+);(.+);(.+)$/);
	let found = line.match(linePat);
	if (!found || found.index !== 0 || found.length !== 4) {
		throw new UnexpectedFormatError('Unexpected format');
	}

	const sep = ['"', "'"];
	const namePat = [new RegExp(/^\s*"(\S*)"\s*$/), new RegExp(/^\s*'(\S*)'\s*$/)];
	for (let j = 1; j < 4; ++j) {
		for (let i = 0; i < namePat.length; ++i) {
			let theFound = found[j].match(namePat[i]);
			if (theFound) {
				found[j] = theFound[1];
			} else if (found[j].indexOf(sep[i]) !== -1) {
				throw new InvalidStringError(`Unexpected format, missing ${sep[i]}`);
			}
		}
	}

	let value = Number(found[3]);

	if (isNaN(value)) {
		throw new InvalidValueError(`Unexpected format, value is not a number: '${found[3].trim()}'`);
	}

	return {
		'from': found[1],
		'to': found[2],
		'value': value,
	};
}

module.exports = {
	UnexpectedFormatError,
	InvalidStringError,
	InvalidValueError,
	separateLine,
};
