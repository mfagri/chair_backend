const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const secretKey = process.env.secret_key;
async function userfind(email){
	try{
		const user = await prisma.user.findUnique({
		 where:{
			email:email
		 }
		})
		
		return user
	}
	catch(e){
		console.log(e)
	}
}
async function userfindbyid(id){
	try{
		const user = await prisma.user.findUnique({
		 where:{
			id:id
		 }
		})
		
		return user
	}
	catch(e){
		console.log(e)
	}
}
async function signuserjwt(user)
{
	console.log(user);
	const token = await jwt.sign({ sub: user.id, username: user.username }, secretKey, {
		expiresIn: '7d', // Token expiration time
	});
	return token
}
async function authenticateToken(req) {
	let user1;
	const token = req.header('Authorization');
  
	if (!token) {
	  return { message: 'Access denied, no token provided' };
	}
  
	 jwt.verify(token, secretKey, (err, user) => {
	  if (err) {
		return { message: 'Invalid token' };
	  }
	  user1 = user;
	  return user1;
	});
	try{
		const user = await  userfindbyid(user1.sub)
		return user ;
	}
	catch(e){}
}

async function createuser(data) {
	
	try{
		
		const user = await prisma.user.create({
			data:{
				username : data.username,
				image:data.image,
				email:data.email,
				password:data.password || "",
			}
		});
		return user
	}
	catch(e){
		console.log('wtf')
	}
}

module.exports = {
	createuser,
	userfind,
	signuserjwt,
	authenticateToken
}