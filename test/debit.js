const assert = require('assert');
const debit = require('../src/debit.js');

describe('separateLine', () => {
	describe('Invalid', () => {
		it('Empty line', () => {
			assert.throws(() => {
				debit.separateLine();
			}, debit.UnexpectedFormatError, "undefined");
			assert.throws(() => {
				debit.separateLine(null);
			}, debit.UnexpectedFormatError, "Null");
			assert.throws(() => {
				debit.separateLine('');
			}, debit.UnexpectedFormatError, "Empty line");
		});

		it('Unexpected format', () => {
			assert.throws(() => {
				debit.separateLine('a');
			}, debit.UnexpectedFormatError, "One char");
			assert.throws(() => {
				debit.separateLine('a,b');
			}, debit.UnexpectedFormatError, "2 columns");
			assert.throws(() => {
				debit.separateLine('a,b,4,d');
			}, debit.UnexpectedFormatError, "4 columns");
		});

		it('Unexpected format, invalid string', () => {
			assert.throws(() => {
				debit.separateLine('"a,b,4');
			}, debit.UnexpectedFormatError, '"a');
			assert.throws(() => {
				debit.separateLine('a",b,5');
			}, debit.UnexpectedFormatError, 'a"');
			assert.throws(() => {
				debit.separateLine('a,"b,4');
			}, debit.UnexpectedFormatError, '"b');
			assert.throws(() => {
				debit.separateLine('a,b",5');
			}, debit.UnexpectedFormatError, 'b"');
			assert.throws(() => {
				debit.separateLine('a,"b" c,5');
			}, debit.UnexpectedFormatError, '"b" c');
		});

		it('Unexpected format, not a number', () => {
			assert.throws(() => {
				debit.separateLine('a,b,c');
			}, debit.InvalidValueError, "c");
			assert.throws(() => {
				debit.separateLine('a,b,5.f');
			}, debit.InvalidValueError, "5.f");
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

			line = debit.separateLine('"ab", b  ,5');
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

			line = debit.separateLine('"ad" ,  "bc","5.5"');
			assert.equal(line.from, 'ad');
			assert.equal(line.to, 'bc');
			assert.equal(line.value, 5.5);
		});
	});
});

describe('saveDebit', () => {
	describe('Empty', () => {
		it('One value', () => {
			let debits = debit.saveDebit(null, {'from': 'a', 'to': 'b', 'value': 1});
			assert.equal(debits['a']['b'], 1);
		});
	});

	describe('Initialized', () => {
		it('Distinct values', () => {
			let debits = debit.saveDebit(null, {'from': 'a', 'to': 'b', 'value': 1});
			assert.equal(debits['a']['b'], 1);

			debits = debit.saveDebit(debits, {'from': 'a1', 'to': 'b', 'value': 2});
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);

			debits = debit.saveDebit(debits, {'from': 'a', 'to': 'b1', 'value': 3});
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);
			assert.equal(debits['a']['b1'], 3);
		});

		it('Aggregate', () => {
			let debits = debit.saveDebit(null, {'from': 'a', 'to': 'b', 'value': 1});
			assert.equal(debits['a']['b'], 1);

			debits = debit.saveDebit(debits, {'from': 'a1', 'to': 'b', 'value': 2});
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);

			debits = debit.saveDebit(debits, {'from': 'a', 'to': 'b1', 'value': 3});
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);
			assert.equal(debits['a']['b1'], 3);

			debits = debit.saveDebit(debits, {'from': 'a1', 'to': 'b', 'value': 4});
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 6);
			assert.equal(debits['a']['b1'], 3);

			debits = debit.saveDebit(debits, {'from': 'a', 'to': 'b', 'value': 7});
			assert.equal(debits['a']['b'], 8);
			assert.equal(debits['a1']['b'], 6);
			assert.equal(debits['a']['b1'], 3);
		});
	});
});

describe('separateLine and saveDebit', () => {
	describe('Initialized', () => {
		it('Distinct values', () => {
			let debits = debit.saveDebit(null, debit.separateLine('a,b,1'));
			assert.equal(debits['a']['b'], 1);

			debits = debit.saveDebit(debits, debit.separateLine('a1,b,2'));
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);

			debits = debit.saveDebit(debits, debit.separateLine('a,b1,3'));
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);
			assert.equal(debits['a']['b1'], 3);
		});

		it('Aggregate', () => {
			let debits = debit.saveDebit(null, debit.separateLine('a,b,1'));
			assert.equal(debits['a']['b'], 1);

			debits = debit.saveDebit(debits, debit.separateLine('a1,b,2'));
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);

			debits = debit.saveDebit(debits, debit.separateLine('a,b1,3'));
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 2);
			assert.equal(debits['a']['b1'], 3);

			debits = debit.saveDebit(debits, debit.separateLine('a1,b,4'));
			assert.equal(debits['a']['b'], 1);
			assert.equal(debits['a1']['b'], 6);
			assert.equal(debits['a']['b1'], 3);

			debits = debit.saveDebit(debits, debit.separateLine('a,b,7'));
			assert.equal(debits['a']['b'], 8);
			assert.equal(debits['a1']['b'], 6);
			assert.equal(debits['a']['b1'], 3);
		});
	});
});
