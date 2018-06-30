const newsController = {}
const newsModel = require('../models/news')

newsController.GET_NEWS = async(req,res)=>{
	try{
		const id = req.user.id; 
		const newsItems = await newsModel.GET_NEWS(id); 
		res.status(200).send(newsItems); 
	}catch(error){
		res.status(500).send(error); 
		console.error(error);
	}
}

module.exports = newsController; 