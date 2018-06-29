const graphRouter = require('express').Router()
const graphController = require('../controllers/graph')
const checkJwt = require('../middleware/auth')

graphRouter
	.route('/topicaverages')
	.get(checkJwt, graphController.GET_TOPIC_AVERAGES)

graphRouter
	.route('/topicsovertime')
	.get(checkJwt, graphController.GET_TOPICS_OVER_TIME)

module.exports = graphRouter; 