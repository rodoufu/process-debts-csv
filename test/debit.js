const assert = require('assert');
const debit = require('../src/debit.js');

describe('separateLine', () => {
	describe('Invalid', () => {
		it('Empty line', () => {
			assert.throws(() => { debit.separateLine(); }, debit.UnexpectedFormatError, "undefined");
			assert.throws(() => { debit.separateLine(null); }, debit.UnexpectedFormatError, "Null");
			assert.throws(() => { debit.separateLine(''); }, debit.UnexpectedFormatError, "Empty line");
		});
		it('Unexpected format', () => {
			assert.throws(() => { debit.separateLine('a'); }, debit.UnexpectedFormatError, "One char");
			assert.throws(() => { debit.separateLine('a,b'); }, debit.UnexpectedFormatError, "2 columns");
			assert.throws(() => { debit.separateLine('a,b,c,d'); }, debit.UnexpectedFormatError, "4 columns");
		});
		it('Unexpected format, invalid string', () => {
			assert.throws(() => { debit.separateLine('"a,b,4'); }, debit.InvalidStringError, '"a');
			assert.throws(() => { debit.separateLine('a",b,5'); }, debit.InvalidStringError, 'a"');
			assert.throws(() => { debit.separateLine('a,"b,4'); }, debit.InvalidStringError, '"b');
			assert.throws(() => { debit.separateLine('a,b",5'); }, debit.InvalidStringError, 'b"');
		});
		it('Unexpected format, not a number', () => {
			assert.throws(() => { debit.separateLine('a,b,c'); }, debit.InvalidValueError, "c");
			assert.throws(() => { debit.separateLine('a,b,5.f'); }, debit.InvalidValueError, "5.f");
		});
	});
	describe('Valid', () => {
		it('Simple', () => {
			let line = debit.separateLine('a,b,5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5);

			line = debit.separateLine('a,b,5.5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.6);
		});
		it('Quotation marks', () => {
			let line = debit.separateLine('"a",b,5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5);

			line = debit.separateLine('a,"b",5.5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.6);

			line = debit.separateLine('a,b,"5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.6);

			line = debit.separateLine('a,"b","5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.6);

			line = debit.separateLine('"a","b","5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.6);
		});

		it('Quotation marks with comma', () => {
			let line = debit.separateLine('"a,b",b,5');
			assert.equal(line.from, 'a,b');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5);

			line = debit.separateLine('a,"b,c",5.5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b,c');
			assert.equal(line.value, 5.6);

			line = debit.separateLine('a,"b,c","5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b,c');
			assert.equal(line.value, 5.6);

			line = debit.separateLine('"a,d","b,c","5.5"');
			assert.equal(line.from, 'a,d');
			assert.equal(line.to, 'b,c');
			assert.equal(line.value, 5.6);
		});
	});
});
