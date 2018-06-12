let {Questions, db} = require('../db');
const questionsModel = {}; 

questionsModel.GET_QUESTIONS = async(interests)=>{
    const questions = await Questions.findAll({
        limit:10,
        attributes:['question','answers','correctAnswer'],
        order: [ [ db.fn('RANDOM') ] ]
    });
    return questions.map(({question, answers: possibleAnswers, correctAnswer: answer})=> ({answer, possibleAnswers, question})); 
};

module.exports = questionsModel;
