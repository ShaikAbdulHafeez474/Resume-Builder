
const express = require("express")

const app = express()

app.get('/health',(req,res)=>{

    res.json({status:'OK',service:'analytics-service'});
})

app.listen(5002,()=>{

    console.log("analytics service is running on port 5002")
})