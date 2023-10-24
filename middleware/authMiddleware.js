const { authenticateToken} = require('../controllers/userController');

const auth = async (req,res,next)=>{
    console.log('in auth');
    const user = await authenticateToken(req);
    req.user = user;
    if(user)
    {
        console.log(user.username);
        next();
        return;
    }
    else
    {
        console.log("Access denied, no token provided");
        res.send('Access denied, no token provided');
    }
};

module.exports ={
    auth
}