const schoolModel = {}
const School = require('../db').Schools
const { Op } = require('sequelize')

schoolModel.GET_SCHOOLS = () => {
  return School.findAll({
    where: {
      isActive: true,
    },
  }).then(schools => {
    return {
      schools,
    }
  })
}


schoolModel.GET_SCHOOL_RANK = async(name)=>{
  try{
  	if(name){
	    pointsObj = await School.findOne({where:{name, isActive: true}, attributes:['points', 'name', 'name']});
	    const rank = await School.count({where: {points: {[Op.gt]: pointsObj.dataValues.points}}})
	    return {rank: rank + 1, name};
  	}
  }catch(error){
    console.error('Error in get rank model', error);
  }
}


schoolModel.GET_TOP_SCHOOLS = async()=>{
	try{
		const topSchool = await School.findAll({
		  attributes:['name', 'points', 'name'], 
		  limit:10,
		  order:[['points', 'DESC'],['updatedAt']]
		});
		return topSchool.map(({dataValues})=> dataValues);
	}catch(error){
		console.error('Error in get rank model', error);
	}
}

schoolModel.GET_SCHOOL_LEADERBOARD = async(name)=>{
	try{
		const topSchoolsPromise = schoolModel.GET_TOP_SCHOOLS(); 
		const schoolRankePromise = schoolModel.GET_SCHOOL_RANK(name); 
		const [topSchools, schoolRank] = await Promise.all([topSchoolsPromise, schoolRankePromise]);
		const leaderboard = topSchools.map((user, index)=> ({...user, rank: index + 1}));
		if(schoolRank){
			if(schoolRank.rank <= 10){
				leaderboard[schoolRank.rank-1].isYourSchool = true; 
			}else{
				leaderboard.push({...schoolRank, isYourSchool:true})
			}
		}
		return leaderboard;
	}catch(error){
		console.error('Error in get school leaderboard model', error); 
	}
}

module.exports = schoolModel
