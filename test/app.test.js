import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotals, entriesForMonth, formatMoney, isValidEntry, parseMoney } from '../app.js';

test('converts Brazilian currency input to integer cents', () => {
  assert.equal(parseMoney('R$ 1.234,56'), 123456);
  assert.equal(parseMoney('19,90'), 1990);
  assert.equal(parseMoney('0'), null);
  assert.equal(parseMoney('12,345'), null);
});

test('calculates income and expenses without floating-point money', () => {
  const totals = calculateTotals([
    { type: 'income', cents: 300050 },
    { type: 'expense', cents: 1990 },
    { type: 'expense', cents: 1010 }
  ]);
  assert.deepEqual(totals, { income: 300050, expense: 3000 });
  assert.match(formatMoney(totals.expense), /30,00/);
});

test('filters entries by month and rejects malformed backups', () => {
  const valid = { id: '1', date: '2026-10-07', type: 'expense', category: 'Casa', cents: 1000, description: '' };
  assert.deepEqual(entriesForMonth([valid, { ...valid, id: '2', date: '2026-09-30' }], '2026-10'), [valid]);
  assert.equal(isValidEntry(valid), true);
  assert.equal(isValidEntry({ ...valid, cents: -1 }), false);
  assert.equal(isValidEntry({ ...valid, category: '<script>' }), false);
});
