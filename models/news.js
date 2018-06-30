const newsModel = {};
const {Op} = require('sequelize'); 
const {Users, News, Schools} = require('../db'); 
const schoolModel = require('./school'); 

newsModel.GET_NEWS = async(id)=>{
	const newsItems = []; 
	const [newsObj, announcements] = await Promise.all([getNews(id), getAnnouncements()]); 
	newsItems.push(...announcements);
	let {news:newsJSON, university, points} = newsObj; 
	if(newsJSON === null) newsJSON = {}; 
	const yourScorePromise = yourScoreChanged(newsJSON, newsItems, points); 
	const yourSchoolPromise = yourSchoolScoreChanged(newsJSON, newsItems, university); 
	const topUserPromise = topScoreChange(newsJSON, newsItems); 
	const topSchoolPromise = topSchoolScoreChange(newsJSON, newsItems);
	await Promise.all([yourScorePromise, yourSchoolPromise, topUserPromise, topSchoolPromise]); 
	noNews(newsItems);
	writeNews(id, newsJSON); 
	return {newsItems}
}

const writeNews = async(id, news)=>{
	console.log('writing:', news, id); 
	Users.update({news}, {where:{id}});
}

const getNews = async(id)=>{
	try{
		let userResult = await Users.findOne(
		{
			attributes:['news', 'university', 'points'],
			where:id
		}); 
		return userResult.dataValues; 
	}catch(error){
		console.error(error)
	}
}
const getAnnouncements = async()=>{
	try{
		let announcements = await News.findAll({
			attributes:['content'],
			where: {expiration:{[Op.gt]: new Date()}}
		})
		announcements = announcements.map(({dataValues})=> dataValues);
		return announcements
	}catch(error){
		console.error(error); 
	}
}

const yourScoreChanged = async(newsJSON, newsItems, points)=>{
	try{
		const {yourRank} = newsJSON; 
		let rank = await Users.count({ where: { points: { [Op.gt]: points } } })
		rank++; 
		newsJSON.yourRank = rank; 
		if(!yourRank) return; 
		if(yourRank > rank){
			newsItems.push({
				content:`You have gone up in rank by ${yourRank - rank} positions. You are now rank: ${rank}. Keep it up!`
			})
		}if(yourRank < rank){
			newsItems.push({
				content:`Your rank has decreased by ${rank - yourRank} positions. You are now rank: ${rank}. Get in there and show them what you know!` 
			})
		}
	}catch(error){
		console.error(error); 
	}
}

const yourSchoolScoreChanged = async(newsJSON, newsItems, university)=>{
	try{
		if(!university) return; 
		const {yourSchoolRank} = newsJSON; 
		const {rank} = await schoolModel.GET_SCHOOL_RANK(university);
		newsJSON.yourSchoolRank = rank; 
		if(!yourSchoolRank) return; 
		if(yourSchoolRank > rank){
			newsItems.push({
				content:`Your school has gone up in rank by ${yourSchoolRank - rank} positions. Go ${university}!`
			})
		}if(yourSchoolRank < rank){
			newsItems.push({
				content: `${university} has gone down ${rank - yourSchoolRank} rungs on the leaderboard.`
			})
		}
	}catch(error){
		console.error(error); 
	}
}
//THIS MAY WANT TO EVENTUALLY INCLUDE CHANGES IN THE TOP 10
const topScoreChange = async(newsJSON, newsItems)=>{
	try{
		const {topUser: prevTopUser = {}} = newsJSON; 
	    let topUser = await Users.findAll({
	      attributes: ['username', 'points', 'university','id'],
	      limit: 1,
	      order: [['points', 'DESC'], ['updatedAt']],
	    })
	    topUser = topUser[0].dataValues;
	    newsJSON.topUser = topUser; 
	    if(prevTopUser.id !== topUser.id){
	    	newsItems.push({
	    		content: `${topUser.username} has taken the top rank with ${topUser.points} points`
	    	})
	    }
	} catch (error) {
		console.error(error)
	}
}

//THIS MAY WANT TO EVENTAULY INCLUDE CHANGES IN THE TOP 10
const topSchoolScoreChange = async(newsJSON, newsItems)=>{
	try{
		const {topSchool:prevTopSchool = {}} = newsJSON;
		let topSchool = await Schools.findAll({
		  attributes:['name', 'points', 'id'], 
		  limit:1,
		  order:[['points', 'DESC'],['updatedAt']]
		});
		topSchool = topSchool[0].dataValues; 
		newsJSON.topSchool = topSchool; 
		if(topSchool.id !== prevTopSchool.id){
			newsItems.push({
				content: `All hail ${topSchool.name}, the top ranked school`
			})
		}
	}catch(error){
		console.error(error); 
	}
}

const noNews = (newsItems)=>{
	if(newsItems.length === 0){
		newsItems.push({
			content: 'it\'s been a bit quiet, play some games to generate some headlines!'
		});
	}
}

module.exports = newsModel; 