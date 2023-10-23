const { authenticateToken} = require('../controllers/userController');

const auth =(req,res,next)=>{
    console.log('in auth');
    const user = authenticateToken(req);
    req.user = user;
    if(user)
    {
        next();
        return;
    }
    else
        res.send('Access denied, no token provided');
};

module.exports ={
    auth
}