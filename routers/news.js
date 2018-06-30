const newsRouter = require('express').Router()
const newsController = require('../controllers/news')
const checkJwt = require('../middleware/auth')

newsRouter
	.route('/')
	.get(checkJwt, newsController.GET_NEWS)

module.exports = newsRouter; 
