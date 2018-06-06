jest.mock('./util');
const util = require('./util'); 

const {setupGame, checkAnswer} = require('./gameManager'); 

const questions = ['foo','bar','baz','thing','otherThing'];
const config = {}; 

test('checkAnswer should properly check against quesitons', ()=>{
	const gameObject = {
		answers: [{}, {}],
		questions:[{answer: 'foo'}]
	};

	const correct = checkAnswer(0, 'foo', 0, gameObject);
	const incorrect = checkAnswer(0, 'bar', 0, gameObject); 

	expect(correct.correct).toEqual(true); 
	expect(incorrect.correct).toEqual(false); 
});

test('checkAnswer should set the results on the gameObject', ()=>{
	const gameObject = {
		answers: [{}, {}],
		questions:[{answer: 'foo'}]
	};

	checkAnswer(0, 'foo', 0, gameObject); 

	expect(gameObject.answers['0']['0'].correct).toEqual(true); 
	expect(gameObject.answers['0']['0'].answer).toEqual('foo'); 
});