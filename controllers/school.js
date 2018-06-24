const schoolController = {}
const schoolModel = require('../models/school')

schoolController.GET_SCHOOLS = (req, res) => {
  schoolModel.GET_SCHOOLS().then(status => {
    res.status(200).send(status)
  })
}


schoolController.GET_SCHOOL_RANK = async(req, res) => {
  try{
    const id = req.params.id; 
    const rank = await schoolModel.GET_SCHOOL_RANK(id);
    res.status(200).send(rank);
  }
  catch(error){
    res.status(500).send(error);
  }
}

schoolController.GET_TOP_SCHOOLS = async(req, res) =>{
  try{
    const topSchools = await schoolModel.GET_TOP_SCHOOLS(); 
    res.status(200).send(topSchools); 
  }catch(error){
    res.status(500).send(error);
  }
}

schoolController.GET_SCHOOL_LEADERBOARD = async(req, res)=>{
  try{
    const leadeboard = await schoolModel.GET_USER_LEADERBOARD(req.params.id);
    res.status(200).send(leadeboard)
  }catch(error){
    res.status(500).send(error); 
  }
}

module.exports = schoolController
