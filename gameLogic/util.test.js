const { findOverlap, findOpponent } = require('./util');


test('findOverlap should return all overlapping interests ', () => {
    const array1 = ['foo', 'bar', 'baz'];
    const array2 = ['foo', 'bar', 'unrelated'];

    const result = findOverlap(array1, array2);

    expect(result).toEqual(['foo', 'bar']);
});
test('findOverlap should return null if there is no match', () => {
    const array1 = ['foo', 'bar', 'baz'];
    const array2 = ['an', 'array', 'unrelated'];

    const result = findOverlap(array1, array2);

    expect(result).toEqual(null);
});

test('findOpponent should return the index and mutual interests of opponent that has overlap', () => {
    const queue = [
        ['foo', 'bar', 'baz'],
        ['other', 'thing', 'unrelated'],
        ['1', '2', '3']
    ];
    const interests = ['thing', 'other'];

    const result = findOpponent(interests, queue);

    expect(result).toEqual({ index: 1, interests: ['other', 'thing'] })
});

test('findOpponent should return null if there is no opponent', () => {
    const queue = [
        ['foo', 'bar', 'baz'],
        ['other', 'thing', 'unrelated'],
        ['1', '2', '3']
    ];
    const interests = ['michelangelo', 'donatello'];

    const result = findOpponent(interests, queue);

    expect(result).toEqual(null);
});