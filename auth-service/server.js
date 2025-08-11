
const express = require("express")

const app = express();

app.get('/health',(req,res)=>{

    res.json({status:'OK',service:'auth-service'});
});

app.listen(5000,()=>{

    console.log("Auth-Service is running on port 5000");
});