
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


function generateJWTToken(username)
{
    return jwt.sign(username,process.env.TOKEN_SECRET);
}

function authenticateJWTToken(req,res,next)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.status(401).send();

    jwt.verify(token, process.env.TOKEN_SECRET, (err,user)=>{
        console.log('FORBIDDEN');

        if(err) return res.status(403).send();

        req.user = user;
        next();
    })
}

module.exports.generateJWTToken = generateJWTToken;
module.exports.authenticateJWTToken = authenticateJWTToken;