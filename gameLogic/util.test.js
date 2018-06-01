const {pickInterest} = require('./util'); 

test('pickInterest should pick a random interest based on players mutual interests',()=>{
	const array1 = ['foo','bar','baz']; 
	const array2 = ['thing','baz','otherThing'];
	const array3 = ['bar', 'foo', 'unrelated'];

	const result = pickInterest(array1, array3);
	const isCorrect = (result === 'foo' || result === 'bar'); 

	expect(pickInterest(array1, array2)).toBe('baz');
	expect(isCorrect).toBe(true)
}); 

test('pickInterest should return null if no overlap',()=>{
	const array1=['foo', 'bar','baz'];
	const array2=['test', 'other','things'];

	expect(pickInterest(array1,array2)).toBe(null); 
})