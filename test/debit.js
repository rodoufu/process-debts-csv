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
			assert.throws(() => { debit.separateLine('a,b,4,d'); }, debit.UnexpectedFormatError, "4 columns");
		});
		it('Unexpected format, invalid string', () => {
			assert.throws(() => { debit.separateLine('"a,b,4'); }, debit.UnexpectedFormatError, '"a');
			assert.throws(() => { debit.separateLine('a",b,5'); }, debit.UnexpectedFormatError, 'a"');
			assert.throws(() => { debit.separateLine('a,"b,4'); }, debit.UnexpectedFormatError, '"b');
			assert.throws(() => { debit.separateLine('a,b",5'); }, debit.UnexpectedFormatError, 'b"');
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
			assert.equal(line.value, 5.5);
		});
		it('Quotation marks', () => {
			let line = debit.separateLine('"a",b,5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5);

			line = debit.separateLine('a,"b",5.5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.5);

			line = debit.separateLine('a,b,"5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.5);

			line = debit.separateLine('a,"b","5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.5);

			line = debit.separateLine('"a","b","5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5.5);
		});

		it('Quotation marks with comma', () => {
			let line = debit.separateLine('"ab",b,5');
			assert.equal(line.from, 'ab');
			assert.equal(line.to, 'b');
			assert.equal(line.value, 5);

			line = debit.separateLine('a,"bc",5.5');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'bc');
			assert.equal(line.value, 5.5);

			line = debit.separateLine('a,"bc","5.5"');
			assert.equal(line.from, 'a');
			assert.equal(line.to, 'bc');
			assert.equal(line.value, 5.5);

			line = debit.separateLine('"ad","bc","5.5"');
			assert.equal(line.from, 'ad');
			assert.equal(line.to, 'bc');
			assert.equal(line.value, 5.5);
		});
	});
});
