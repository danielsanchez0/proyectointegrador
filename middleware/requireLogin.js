const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');

const modelo = require("../models/index")
const User = modelo.User

module.exports = (req,res,next)=>{
	const {authorization} = req.headers;

	if(!authorization){
		return res.status(401).json({error:"you must be logged"})
	}

	const token = authorization.replace("Bearer ","");
	jwt.verify(token,JWT_SECRET,(err,payload)=>{
		if(err){
			return res.status(401).json({error:"you must be logged"})
		}

		const {id} = payload
		User.findById(id).then(userdata=>{
			req.user = userdata;
			next();
		})	
	})
}