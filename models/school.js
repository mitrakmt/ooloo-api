const schoolModel = {}
const School = require('../db').Schools
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


schoolModel.GET_SCHOOL_RANK = async(id)=>{
  try{
    pointsObj = await School.findOne({where:{id, isActive: true}, attributes:['points', 'name', 'id']});
    const rank = await School.count({where: {points: {[Op.gt]: pointsObj.dataValues.points}}})
    return {rank: rank + 1, name, id};
  }catch(error){
    console.error('Error in get rank model', error);
  }
}


schoolModel.GET_TOP_SCHOOLS = async()=>{
	try{
		const topSchool = await School.findAll({
		  attributes:['name', 'points', 'id'], 
		  limit:10,
		  order:[['points', 'DESC'],['updatedAt']]
		});
		return topSchool.map(({dataValues})=> dataValues);
	}catch(error){
		console.error('Error in get rank model', error);
	}
}

schoolModel.GET_SCHOOL_LEADERBOARD = async(id)=>{
	try{
		const topSchoolsPromise = schoolModel.GET_TOP_USERS(); 
		const schoolRankePromise = schoolModel.GET_USER_RANK(id); 
		const [topSchools, schoolRank] = await Promise.all(topSchoolsPromise, schoolRankePromise);
		const leaderboard = topSchools.map((user, index)=> ({...user, rank: index + 1}));
		if(schoolRan.rankk <= 10){
			leaderboard[rank-1].isYou = true; 
		}else{
			derboard.push({...schoolRank, isYourSChool:true})
		}
	}catch(error){
		console.error('Error in get school leaderboard model'); 
	}
}

module.exports = schoolModel
