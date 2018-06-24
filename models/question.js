const { Questions, db, Answers } = require('../db')
const Sequelize = require('sequelize'); 
const questionsModel = {}
const {Op} = Sequelize;

questionsModel.GET_QUESTIONS = async interests => {
  const questions = await Questions.findAll({
    limit: 10,
    attributes: ['id', 'question', 'answers', 'correctAnswer'],
    order: [[db.fn('RANDOM')]],
  })
  return questions.map(({ id: questionId, question, answers: possibleAnswers, correctAnswer: answer }) => ({
    answer,
    possibleAnswers,
    question,
    questionId,
  }))
}

questionsModel.GET_BIASED_QUESTIONS = async (interests, playersArray) =>{
  try{
    const orArray = playersArray.map(({id})=> ({userId:id}))
    let questions = await Questions.findAll({
      attributes:{
        include: [[Sequelize.fn("COUNT", Sequelize.col("userAnswers.id")), "numAnswered"]]
      }, 
      include:{duplicate: false, model: Answers, as:'userAnswers', attributes:[]},
      group:'questions.id',
      raw:true,
      order:[[Sequelize.literal('"numAnswered" ASC')]]
    })
    questions = questions.slice(0,10);
    return questions.map(({ id: questionId, question, answers: possibleAnswers, correctAnswer: answer }) => ({
    answer,
    possibleAnswers,
    question,
    questionId,
  }));
  }catch(error){
    console.error(error);
  }
}

module.exports = questionsModel
