import test from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateLevelProgress,
    defaultUserProfile,
    defaultWalletOrders,
    topUpWallet,
    validateAndUpdateProfile,
} from './profileLogic';

test('calculateLevelProgress computes bounded percentage accurately', () => {
    assert.equal(calculateLevelProgress(1450, 2000), 73);
    assert.equal(calculateLevelProgress(2500, 2000), 100);
    assert.equal(calculateLevelProgress(-50, 2000), 0);
    assert.equal(calculateLevelProgress(500, 0), 0);
});

test('topUpWallet increases balance and prepends a paid wallet order', () => {
    const result = topUpWallet(480000, 200000, defaultWalletOrders, '۱۴ اردیبهشت ۱۴۰۴');
    assert.equal(result.balance, 680000);
    assert.equal(result.orders.length, defaultWalletOrders.length + 1);
    assert.equal(result.orders[0].category, 'شارژ کیف پول');
    assert.equal(result.orders[0].amount, 200000);
    assert.equal(result.orders[0].status, 'paid');
});

test('validateAndUpdateProfile rejects empty name or invalid phone numbers and updates valid fields', () => {
    const invalidName = validateAndUpdateProfile(defaultUserProfile, { name: ' ' });
    assert.equal(invalidName.valid, false);
    assert.ok(invalidName.error);

    const invalidParent = validateAndUpdateProfile(defaultUserProfile, { parentPhone: '123' });
    assert.equal(invalidParent.valid, false);

    const validUpdate = validateAndUpdateProfile(defaultUserProfile, {
        name: 'آرین رضایی',
        city: 'شیراز',
        gradeAndField: 'پایه دهم · تجربی',
    });
    assert.equal(validUpdate.valid, true);
    assert.equal(validUpdate.profile.name, 'آرین رضایی');
    assert.equal(validUpdate.profile.city, 'شیراز');
    assert.equal(validUpdate.profile.gradeAndField, 'پایه دهم · تجربی');
});
