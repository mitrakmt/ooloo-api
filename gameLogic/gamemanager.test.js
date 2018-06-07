jest.mock('./util');
const util = require('./util'); 

const {setupGame, checkAnswer, getCurrentGameState} = require('./gameManager'); 

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

test('getCurrentGameState should correctly tally scores', ()=>{
	const gameObject = {
		pointsPerQuestion: 1000,
		answers:[
			[{correct: true},{correct: false}],
			[{correct: false},{correct: false}],
			[{correct: true},{correct: false}]
		]
	};

	const results = getCurrentGameState(gameObject); 

	expect(results.score).toEqual([2000,0]);
});
test('getCurrentGameState should tell me how many I have correct', ()=>{
	const gameObject = {
		answers:[
			[{correct: true},{correct: false}],
			[{correct: false},{correct: false}],
			[{correct: true},{correct: false}]
		]
	};

	const results = getCurrentGameState(gameObject); 

	expect(results.totalCorrect).toEqual([2,0]);
});

test('getCurrentGameState should tell me how many questions I have answered', ()=>{
	const gameObject = {
		answers:[
			[{correct: true},{correct: false}],
			[{correct: false},{correct: false}],
			[{correct: true},{}],
			[{}, {}]
		]
	};

	const results = getCurrentGameState(gameObject); 

	expect(results.totalAnswered).toEqual([3,2]);
});