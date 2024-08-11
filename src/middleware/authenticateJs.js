const jwt = require("jsonwebtoken")
const mysql = require("mysql")
const client = require("../config/db")

const authenticateJs = async (req, res, next) =>{
    const token = req.headers["authorization"]

    if(!token){
        return res.status(401).send("Access Denied...")
    }

    const decode = jwt.verify(token,process.env.secret);


    const user = decode.username
    console.log(user)

    const query = `SELECT * FROM users WHERE username = ?`;

    client.query(query,[user],(err,result)=>{
        if(err){
            return res.status(500).send("Internal Server Error...")
        }
        else{
            console.log(result)
            if(result.length === 0){
                return res.status(401).send("Unauthorized...")
            }
            next();
        }
    })
}

module.exports = authenticateJs