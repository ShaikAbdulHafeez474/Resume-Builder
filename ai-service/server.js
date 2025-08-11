
const express = require("express")

const app = express()

app.get('/health',(req,res)=>{

    res.json({status:"OK",service:'AI-Service'});
})

app.listen(5001,()=>{

    console.log("ai-service is running on port 5001");
})