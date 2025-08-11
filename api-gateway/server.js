
const express = require("express")

const app = express()

app.get('/health',(req,res)=>{

    res.json({status:'OK',service:'api-gateway'});
})

app.listen(5003,()=>{

    console.log("api-gateway service is running on port 5003");
})