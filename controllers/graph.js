const graphController = {}
const {getAveragesGraph} = require('../graphs/averageTopicBarGraph');
const {getTopicsOverTime} = require('../graphs/topicOverTimeGraph');

graphController.GET_TOPIC_AVERAGES = async(req,res)=>{
	try{
		const id = req.user.id;
		const topics = req.query.topics.split(',').map((id)=>({id})); 
		const graphData = await getAveragesGraph(id, topics); 
		res.status(200).send(graphData); 
	}catch(error){
		res.stats(500).send(error); 
	}
}

graphController.GET_TOPICS_OVER_TIME = async(req,res)=>{
	try{
		const id = req.user.id;
		const topics = req.query.topics.split(',').map((id)=>({id})); 
		const graphData = await getTopicsOverTime(id, topics, 'day'); 
		res.status(200).send(graphData); 
	}catch(error){
		res.stats(500).send(error); 
	}
}

module.exports = graphController; 