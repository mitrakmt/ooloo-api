const { Questions, db } = require('../db')
const questionsModel = {}

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

module.exports = questionsModel
